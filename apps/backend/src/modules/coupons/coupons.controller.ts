import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CouponDto, CreateCouponDto } from './dto/coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('validate')
  @ApiOperation({ summary: 'Validate a promotion coupon' })
  @ApiQuery({ name: 'code', type: String })
  @ApiQuery({ name: 'orderAmount', type: Number })
  async validateCoupon(@Query('code') code: string, @Query('orderAmount') amountStr: string): Promise<CouponDto> {
    const amount = parseFloat(amountStr);
    const coupon = await this.couponsService.validateCoupon(code, amount);
    return {
      id: coupon._id.toString(),
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
      validUntil: coupon.validUntil,
    };
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create promo coupon (Admin)' })
  async createCoupon(@Body() createCouponDto: CreateCouponDto): Promise<CouponDto> {
    const coupon = await this.couponsService.createCoupon(createCouponDto);
    return {
      id: coupon._id.toString(),
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
      validUntil: coupon.validUntil,
    };
  }
}
