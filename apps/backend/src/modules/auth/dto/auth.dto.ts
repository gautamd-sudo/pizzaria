import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class SignUpDto {
  @ApiProperty({ example: 'Lukas Weber' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'lukas@example.de' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secure_password_123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '+49 123 456789', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'lukas@example.de' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secure_password_123' })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
