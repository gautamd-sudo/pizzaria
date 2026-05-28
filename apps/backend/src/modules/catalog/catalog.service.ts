import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/catalog.dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAllCategories(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().sort({ displayOrder: 1 }).exec();
  }

  async createCategory(name: string, displayOrder: number): Promise<CategoryDocument> {
    const category = new this.categoryModel({ name, displayOrder, isPublished: true });
    return category.save();
  }

  async reorderCategories(categoryIds: string[]): Promise<void> {
    const bulkOps = categoryIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { displayOrder: index } },
      },
    }));
    await this.categoryModel.bulkWrite(bulkOps);
  }

  async findProducts(categoryId?: string, isAvailable?: boolean, page: number = 1, limit: number = 20): Promise<{ data: ProductDocument[], total: number }> {
    const filter: any = {};
    if (categoryId) {
      filter.categoryId = new Types.ObjectId(categoryId);
    }
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable;
    }

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findProductById(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const product = new this.productModel({
      ...createProductDto,
      categoryId: new Types.ObjectId(createProductDto.categoryId),
      addonIds: createProductDto.addonIds ? createProductDto.addonIds.map(id => new Types.ObjectId(id)) : [],
    });
    return product.save();
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
    const updateData: any = { ...updateProductDto };
    if (updateProductDto.categoryId) {
      updateData.categoryId = new Types.ObjectId(updateProductDto.categoryId);
    }
    if (updateProductDto.addonIds) {
      updateData.addonIds = updateProductDto.addonIds.map(addonId => new Types.ObjectId(addonId));
    }

    const updated = await this.productModel.findByIdAndUpdate(id, { $set: updateData }, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }
}
