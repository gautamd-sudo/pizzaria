import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'pizzarally_secret_key_12345';
      const decoded = jwt.verify(token, secret);
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Authentication token invalid or expired');
    }
  }
}
