import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { CreateOrderDto, OrderDto } from './dto/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Place a new order' })
  async create(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const order = await this.ordersService.createOrder(user.id, createOrderDto);
    return this.mapToDto(order);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check active order status' })
  async getOrder(@Param('id') id: string): Promise<OrderDto> {
    const order = await this.ordersService.findById(id);
    return this.mapToDto(order);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Query orders pipeline list (Admin)' })
  @ApiQuery({ name: 'status', required: false })
  async getPipeline(@Query('status') status?: string): Promise<OrderDto[]> {
    const list = await this.ordersService.findPipeline(status);
    return list.map(o => this.mapToDto(o));
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Transition order state (Admin)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; driverName?: string },
  ): Promise<OrderDto> {
    const order = await this.ordersService.updateStatus(id, body.status, body.driverName);
    return this.mapToDto(order);
  }

  private mapToDto(o: any): OrderDto {
    return {
      id: o._id.toString(),
      orderNumber: o.orderNumber,
      customerId: o.customerId.toString(),
      items: o.items.map((i: any) => ({
        productId: i.productId.toString(),
        name: i.name,
        selectedVariantId: i.selectedVariantId,
        selectedAddons: i.selectedAddons.map((a: any) => ({
          addonId: a.addonId.toString(),
          name: a.name,
          price: a.price,
        })),
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      discountAmount: o.discountAmount,
      total: o.total,
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      deliveryAddress: {
        street: o.deliveryAddress.street,
        zipCode: o.deliveryAddress.zipCode,
        city: o.deliveryAddress.city,
        note: o.deliveryAddress.note,
      },
      driverName: o.driverName,
      createdAt: o.createdAt,
    };
  }
}
