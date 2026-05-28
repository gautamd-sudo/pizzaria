import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @ApiProperty({ example: 'Friedrichstraße 101' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: '10117' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ example: 'Berlin' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Ring the bottom bell', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ enum: ['customer', 'admin', 'driver'] })
  role: string;

  @ApiProperty({ type: [AddressDto] })
  addresses: AddressDto[];
}
