import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsEnum, IsOptional, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '../../users/dto/user.dto';

export class SelectedAddonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addonId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}

export class CreateOrderItemDto {
  @ApiProperty({ example: '6655bc...productId' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  selectedVariantId?: string;

  @ApiProperty({ type: [SelectedAddonDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SelectedAddonDto)
  selectedAddons?: SelectedAddonDto[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ example: 'SUMMER20', required: false })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiProperty({ enum: ['credit_card', 'paypal', 'cash_on_delivery'], example: 'credit_card' })
  @IsEnum(['credit_card', 'paypal', 'cash_on_delivery'])
  paymentMethod: string;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress: AddressDto;
}

export class OrderItemDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  selectedVariantId?: string;

  @ApiProperty({ type: [SelectedAddonDto] })
  selectedAddons: SelectedAddonDto[];

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}

export class OrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  deliveryFee: number;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ enum: ['new', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'] })
  status: string;

  @ApiProperty({ enum: ['unpaid', 'paid', 'refunded'] })
  paymentStatus: string;

  @ApiProperty({ enum: ['credit_card', 'paypal', 'cash_on_delivery'] })
  paymentMethod: string;

  @ApiProperty({ type: AddressDto })
  deliveryAddress: AddressDto;

  @ApiProperty({ required: false })
  driverName?: string;

  @ApiProperty()
  createdAt: Date;
}
