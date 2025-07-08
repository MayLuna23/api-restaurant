import {
  Injectable,
  Logger,
  InternalServerErrorException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { successResponse, errorResponse } from 'src/common/responses';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  // Create a new product
  async create(newProductData: CreateProductDto) {
  const method = 'create';
  this.logger.log(`[ProductsService][${method}] Creating product`);

  try {
    // Verify if product with the same name already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { name: newProductData.name },
    });

    if (existingProduct) {
      this.logger.warn(`[ProductsService][${method}] Product with name "${newProductData.name}" already exists`);
      throw new ConflictException(
        errorResponse(409, 'Product already exists', `A product with name "${newProductData.name}" already exists`),
      );
    }

    const product = await this.prisma.product.create({
      data: newProductData,
    });

    this.logger.log(`[ProductsService][${method}] Product created`);

    await this.cacheManager.del('products:all');
    return successResponse(product, 201, 'Product created successfully');
  } catch (error) {
    this.logger.error(
      `[ProductsService][${method}] Error creating product: ${error.message}`,
      error.stack,
    );

    if (error instanceof ConflictException) {
      throw error;
    }

    throw new InternalServerErrorException(
      errorResponse(500, 'Error creating product', error.message),
    );
  }
}


  // Get all products with caching
  async findAll() {
    const method = 'findAll';
    const cacheKey = 'products:all';
    this.logger.log(`[ProductsService][${method}] Checking cache`);

    try {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        this.logger.log(`[ProductsService][${method}] Returning from cache`);
        return successResponse(cached, 200, 'Products found successfully (cache)');
      }

      this.logger.log(`[ProductsService][${method}] Cache miss. Querying database...`);
      const products = await this.prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });

      this.logger.log(`[ProductsService][${method}] Caching ${products.length} products`);

      // Every time we fetch products, we cache the result
      await this.cacheManager.set(cacheKey, products);

      return successResponse(products, 200, 'Products found successfully');
    } catch (error) {
      this.logger.error(
        `[ProductsService][${method}] Error fetching products: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        errorResponse(500, 'Error fetching products', error.message),
      );
    }
  }

 
}
