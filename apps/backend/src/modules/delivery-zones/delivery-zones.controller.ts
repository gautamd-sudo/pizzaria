import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DeliveryZonesService } from './delivery-zones.service';

@ApiTags('Delivery Zones')
@Controller('delivery-zones')
export class DeliveryZonesController {
  constructor(private readonly zonesService: DeliveryZonesService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch active delivery coverage zones' })
  async getZones() {
    const list = await this.zonesService.findAll();
    return list.map(z => ({
      id: z._id.toString(),
      name: z.name,
      minOrderValue: z.minOrderValue,
      deliveryFee: z.deliveryFee,
      geometry: z.geometry,
    }));
  }

  @Post('check')
  @ApiOperation({ summary: 'Verify if coordinate is within delivery limits' })
  async checkLocation(@Body() body: { latitude: number; longitude: number }) {
    const zone = await this.zonesService.checkLocation(body.latitude, body.longitude);
    if (!zone) {
      return {
        inRange: false,
        deliveryFee: 0,
        minOrderValue: 0,
      };
    }
    return {
      inRange: true,
      deliveryFee: zone.deliveryFee,
      minOrderValue: zone.minOrderValue,
    };
  }
}
