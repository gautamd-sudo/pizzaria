import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CouponDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ enum: ['percentage', 'fixed_amount', 'free_delivery'] })
  discountType: string;

  @ApiProperty()
  value: number;

  @ApiProperty({ required: false })
  minOrderAmount?: number;

  @ApiProperty()
  validUntil: Date;
}

export class CreateCouponDto {
  @ApiProperty({ example: 'SUMMER20' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: ['percentage', 'fixed_amount', 'free_delivery'], example: 'percentage' })
  @IsEnum(['percentage', 'fixed_amount', 'free_delivery'])
  discountType: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  value: number;

  @ApiProperty({ example: 15, required: false })
  @IsNumber()
  @IsOptional()
  minOrderAmount?: number;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  @IsDateString()
  validFrom: string;

  @ApiProperty({ example: '2026-09-01T00:00:00.000Z' })
  @IsDateString()
  validUntil: string;

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  usageLimit?: number;
}
