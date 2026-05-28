import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SignUpDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const existing = await this.usersService.findByEmail(signUpDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(signUpDto.password, salt);

    const user = await this.usersService.create(
      signUpDto.name,
      signUpDto.email,
      passwordHash,
      signUpDto.phone,
    );

    const token = this.generateToken(user);
    return {
      accessToken: token,
      user: this.mapToDto(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Authentication credentials invalid');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Authentication credentials invalid');
    }

    const token = this.generateToken(user);
    return {
      accessToken: token,
      user: this.mapToDto(user),
    };
  }

  private generateToken(user: any): string {
    const secret = this.configService.get<string>('JWT_SECRET') || 'pizzarally_secret_key_12345';
    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    return jwt.sign(payload, secret, { expiresIn: '1d' });
  }

  private mapToDto(user: any) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses.map((a: any) => ({
        street: a.street,
        zipCode: a.zipCode,
        city: a.city,
        note: a.note,
      })),
    };
  }
}
