import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

describe('CatalogController (Integration)', () => {
  let app: INestApplication;
  let catalogService: jest.Mocked<CatalogService>;

  const mockCategories = [
    { _id: 'cat-1', name: 'Pizza', displayOrder: 1, isPublished: true },
    { _id: 'cat-2', name: 'Pasta', displayOrder: 2, isPublished: true },
  ];

  const mockProducts = [
    {
      _id: 'prod-1',
      name: 'Margherita',
      description: 'Classic Margherita pizza',
      price: 9.99,
      categoryId: 'cat-1',
      imageUrl: 'http://example.com/pizza.jpg',
      tags: ['Bestseller'],
      variants: [],
      addonIds: [],
      prepTimeRange: '15-20 min',
      isAvailable: true,
    },
  ];

  beforeEach(async () => {
    const mockCatalogService = {
      findAllCategories: jest.fn().mockResolvedValue(mockCategories),
      findProducts: jest.fn().mockResolvedValue({ data: mockProducts, total: 1 }),
      createCategory: jest.fn(),
      reorderCategories: jest.fn(),
      findProductById: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        { provide: CatalogService, useValue: mockCatalogService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // bypass auth for basic integration assertions
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    catalogService = moduleFixture.get(CatalogService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /categories', () => {
    it('should return a list of categories mapped to DTOs', async () => {
      const response = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toEqual({
        id: 'cat-1',
        name: 'Pizza',
        displayOrder: 1,
        isPublished: true,
      });
      expect(catalogService.findAllCategories).toHaveBeenCalled();
    });
  });

  describe('GET /products', () => {
    it('should query products and return mapped paginated DTO list', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ categoryId: 'cat-1', isAvailable: 'true' })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total', 1);
      expect(response.body.data[0].id).toBe('prod-1');
      expect(catalogService.findProducts).toHaveBeenCalledWith('cat-1', true, 1, 20);
    });
  });
});
