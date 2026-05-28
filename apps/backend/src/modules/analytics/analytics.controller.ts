import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('widgets')
  @ApiOperation({ summary: 'Retrieve Admin Dashboard aggregate statistics' })
  async getWidgets() {
    return this.analyticsService.getWidgetsData();
  }

  @Get('orders-channel')
  @ApiOperation({ summary: 'Retrieve order volume breakdown by purchase channel' })
  async getOrdersChannel() {
    return this.analyticsService.getOrdersChannelData();
  }
}
