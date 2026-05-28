import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/order.dto';
import { CatalogService } from '../catalog/catalog.service';
import { CouponsService } from '../coupons/coupons.service';
import { OrderGateway } from '../gateway/order.gateway';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly catalogService: CatalogService,
    private readonly couponsService: CouponsService,
    private readonly orderGateway: OrderGateway,
    @InjectQueue('orders') private ordersQueue: Queue,
  ) {}

  async createOrder(customerId: string, createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    let subtotal = 0;
    const items = [];

    // 1. Calculate price from DB catalog data
    for (const item of createOrderDto.items) {
      const product = await this.catalogService.findProductById(item.productId);
      if (!product.isAvailable) {
        throw new BadRequestException(`Product ${product.name} is currently not available`);
      }

      let price = product.price;

      // Handle variant delta
      if (item.selectedVariantId) {
        const variant = product.variants.find(v => v.variantId === item.selectedVariantId);
        if (!variant) {
          throw new BadRequestException(`Variant ${item.selectedVariantId} not found`);
        }
        price += variant.priceDelta;
      }

      // Handle addons
      const selectedAddons = [];
      if (item.selectedAddons) {
        for (const addon of item.selectedAddons) {
          price += addon.price;
          selectedAddons.push({
            addonId: new Types.ObjectId(addon.addonId),
            name: addon.name,
            price: addon.price,
          });
        }
      }

      subtotal += price * item.quantity;
      items.push({
        productId: product._id,
        name: product.name,
        selectedVariantId: item.selectedVariantId,
        selectedAddons,
        quantity: item.quantity,
        price,
      });
    }

    // 2. Validate coupon if applicable
    let discountAmount = 0;
    let couponId: Types.ObjectId | null = null;
    if (createOrderDto.couponCode) {
      const coupon = await this.couponsService.validateCoupon(createOrderDto.couponCode, subtotal);
      couponId = coupon._id as Types.ObjectId;
      if (coupon.discountType === 'percentage') {
        discountAmount = subtotal * (coupon.value / 100);
      } else if (coupon.discountType === 'fixed_amount') {
        discountAmount = coupon.value;
      } else if (coupon.discountType === 'free_delivery') {
        // Handled in delivery calculations
      }
    }

    const deliveryFee = 1.50; // Standard base fee from UI spec
    const total = subtotal + deliveryFee - discountAmount;

    // 3. Save order
    const orderNumber = `PR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = new this.orderModel({
      orderNumber,
      customerId: new Types.ObjectId(customerId),
      items,
      subtotal,
      deliveryFee,
      couponId,
      discountAmount,
      total,
      status: 'new',
      paymentStatus: createOrderDto.paymentMethod === 'cash_on_delivery' ? 'unpaid' : 'unpaid',
      paymentMethod: createOrderDto.paymentMethod,
      deliveryAddress: createOrderDto.deliveryAddress,
    });

    const savedOrder = await newOrder.save();

    // 4. Update coupon count
    if (couponId) {
      await this.couponsService.incrementUsage(couponId.toString());
    }

    // 5. Emit WebSockets alert
    this.orderGateway.emitOrderCreated(savedOrder);

    // 6. Push job to BullMQ queue for payment validation timeout
    await this.ordersQueue.add('validate-payment-timeout', { orderId: savedOrder._id.toString() }, { delay: 600000 }); // 10 minutes delay

    return savedOrder;
  }

  async findById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findPipeline(status?: string): Promise<OrderDocument[]> {
    const filter = status ? { status } : {};
    return this.orderModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async updateStatus(id: string, status: string, driverName?: string): Promise<OrderDocument> {
    const update: any = { status };
    if (driverName) {
      update.driverName = driverName;
    }
    if (status === 'delivered') {
      update.paymentStatus = 'paid'; // Cash on delivery collected
    }

    const updated = await this.orderModel.findByIdAndUpdate(id, { $set: update }, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Order not found');
    }

    // Emit live WebSocket status update
    this.orderGateway.emitOrderStatusUpdate(updated._id.toString(), status, updated.driverName);

    return updated;
  }
}
