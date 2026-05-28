import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards, ParseBoolPipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CategoryDto, ProductDto, CreateProductDto, UpdateProductDto, PaginatedProductsDto } from './dto/catalog.dto';

@ApiTags('Catalog')
@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Retrieve catalog categories list' })
  async getCategories(): Promise<CategoryDto[]> {
    const list = await this.catalogService.findAllCategories();
    return list.map(c => this.mapCategoryToDto(c));
  }

  @Post('admin/categories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create new category (Admin)' })
  async createCategory(@Body() body: { name: string; displayOrder: number }): Promise<CategoryDto> {
    const category = await this.catalogService.createCategory(body.name, body.displayOrder);
    return this.mapCategoryToDto(category);
  }

  @Patch('admin/categories/reorder')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Reorder categories sequence (Admin)' })
  async reorderCategories(@Body() body: { categoryIds: string[] }): Promise<void> {
    await this.catalogService.reorderCategories(body.categoryIds);
  }

  @Get('products')
  @ApiOperation({ summary: 'Query catalog menu products' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'isAvailable', required: false, type: Boolean })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async queryProducts(
    @Query('categoryId') categoryId?: string,
    @Query('isAvailable') isAvailable?: string,
    @Query('limit') limitStr?: string,
    @Query('page') pageStr?: string,
  ): Promise<PaginatedProductsDto> {
    const isAvail = isAvailable === undefined ? undefined : isAvailable === 'true';
    const limit = limitStr ? parseInt(limitStr, 10) : 20;
    const page = pageStr ? parseInt(pageStr, 10) : 1;

    const { data, total } = await this.catalogService.findProducts(categoryId, isAvail, page, limit);

    return {
      data: data.map(p => this.mapProductToDto(p)),
      total,
      page,
      limit,
    };
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Fetch single product details' })
  async getProductById(@Param('id') id: string): Promise<ProductDto> {
    const product = await this.catalogService.findProductById(id);
    return this.mapProductToDto(product);
  }

  @Post('admin/products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Add new product (Admin)' })
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = await this.catalogService.createProduct(createProductDto);
    return this.mapProductToDto(product);
  }

  @Patch('admin/products/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Edit product details & toggle availability (Admin)' })
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductDto> {
    const product = await this.catalogService.updateProduct(id, updateProductDto);
    return this.mapProductToDto(product);
  }

  private mapCategoryToDto(c: any): CategoryDto {
    return {
      id: c._id.toString(),
      name: c.name,
      displayOrder: c.displayOrder,
      isPublished: c.isPublished,
    };
  }

  private mapProductToDto(p: any): ProductDto {
    return {
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      categoryId: p.categoryId.toString(),
      imageUrl: p.imageUrl,
      tags: p.tags,
      variants: p.variants.map((v: any) => ({
        variantId: v.variantId,
        name: v.name,
        priceDelta: v.priceDelta,
        isAvailable: v.isAvailable,
      })),
      addonIds: p.addonIds.map((id: any) => id.toString()),
      prepTimeRange: p.prepTimeRange,
      isAvailable: p.isAvailable,
    };
  }
}
