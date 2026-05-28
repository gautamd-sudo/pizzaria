import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PosService } from './pos.service';

@ApiTags('POS Integration')
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post('heartbeat')
  @ApiOperation({ summary: 'Record active POS device connection heartbeat' })
  async recordHeartbeat(@Body() body: { deviceId: string; status: string }) {
    await this.posService.recordHeartbeat(body.deviceId, body.status);
    return { success: true };
  }
}
