import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a consumer account' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async signup(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signup(signUpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in using credentials' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
