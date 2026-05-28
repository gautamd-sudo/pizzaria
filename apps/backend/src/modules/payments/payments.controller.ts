import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-session')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initialize checkout billing transaction session' })
  async createSession(@Body() body: { orderId: string; amount: number; gateway: string }) {
    return this.paymentsService.createSession(body.orderId, body.amount, body.gateway);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Receive payment transaction callback alerts' })
  async handleWebhook(@Body() body: any) {
    await this.paymentsService.processWebhook(body);
    return { success: true };
  }
}
