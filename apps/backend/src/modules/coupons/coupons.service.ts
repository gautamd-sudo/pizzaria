import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { CreateCouponDto, CouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  async validateCoupon(code: string, orderAmount: number): Promise<CouponDocument> {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() }).exec();
    if (!coupon) {
      throw new NotFoundException('Coupon code not found');
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new BadRequestException('Coupon code is expired or not active yet');
    }

    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon code usage limit reached');
    }

    if (orderAmount < coupon.minOrderAmount) {
      throw new BadRequestException(`Minimum order value of €${coupon.minOrderAmount} required for this coupon`);
    }

    return coupon;
  }

  async incrementUsage(id: string): Promise<void> {
    await this.couponModel.findByIdAndUpdate(id, { $inc: { usageCount: 1 } }).exec();
  }

  async createCoupon(createCouponDto: CreateCouponDto): Promise<CouponDocument> {
    const newCoupon = new this.couponModel({
      ...createCouponDto,
      code: createCouponDto.code.toUpperCase(),
    });
    return newCoupon.save();
  }
}
