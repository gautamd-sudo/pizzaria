import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeliveryZone, DeliveryZoneDocument } from './schemas/delivery-zone.schema';

@Injectable()
export class DeliveryZonesService {
  constructor(@InjectModel(DeliveryZone.name) private zoneModel: Model<DeliveryZoneDocument>) {}

  async checkLocation(latitude: number, longitude: number): Promise<DeliveryZoneDocument | null> {
    // Find delivery zone that contains this point
    const zone = await this.zoneModel.findOne({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude], // GeoJSON uses longitude, latitude
          },
        },
      },
    }).exec();

    return zone;
  }

  async findAll(): Promise<DeliveryZoneDocument[]> {
    return this.zoneModel.find().exec();
  }

  async createZone(name: string, coordinates: number[][][], minOrderValue: number, deliveryFee: number): Promise<DeliveryZoneDocument> {
    const zone = new this.zoneModel({
      name,
      geometry: {
        type: 'Polygon',
        coordinates,
      },
      minOrderValue,
      deliveryFee,
    });
    return zone.save();
  }
}
