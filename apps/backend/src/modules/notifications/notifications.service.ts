import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

  async createNotification(userId: string, title: string, body: string, channel: string): Promise<NotificationDocument> {
    const notify = new this.notificationModel({
      userId: new Types.ObjectId(userId),
      title,
      body,
      channel,
      isRead: false,
    });
    return notify.save();
  }
}
