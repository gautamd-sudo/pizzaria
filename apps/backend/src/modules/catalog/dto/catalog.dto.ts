import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  displayOrder: number;

  @ApiProperty()
  isPublished: boolean;
}

export class ProductVariantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  priceDelta: number;

  @ApiProperty()
  @IsBoolean()
  isAvailable: boolean;
}

export class ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty({ type: [ProductVariantDto] })
  variants: ProductVariantDto[];

  @ApiProperty({ type: [String] })
  addonIds: string[];

  @ApiProperty()
  prepTimeRange: string;

  @ApiProperty()
  isAvailable: boolean;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: [ProductVariantDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  addonIds?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  prepTimeRange?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: [ProductVariantDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  addonIds?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  prepTimeRange?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class PaginatedProductsDto {
  @ApiProperty({ type: [ProductDto] })
  data: ProductDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
