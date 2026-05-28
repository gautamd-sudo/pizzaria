import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, Address } from './schemas/user.schema';
import { AddressDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(name: string, email: string, passwordHash: string, phone?: string, role: string = 'customer'): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      passwordHash,
      phone,
      role,
      addresses: [],
    });
    return newUser.save();
  }

  async addAddress(userId: string, addressDto: AddressDto): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.addresses.push(addressDto as Address);
    return user.save();
  }

  async removeAddress(userId: string, index: number): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (index < 0 || index >= user.addresses.length) {
      throw new NotFoundException('Address not found at index');
    }
    user.addresses.splice(index, 1);
    return user.save();
  }
}
