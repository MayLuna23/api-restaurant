import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, ProductConflictResponse } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ProductListResponse, SingleProductResponse } from './dto/product-response.dto';
import { ErrorResponseDto } from 'src/common/error-response.dto';


@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Create a new product (admin only)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: SingleProductResponse })
  @ApiResponse({ status: 409, description: 'Product already exists', type: ProductConflictResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponseDto })
  create(@Body() newProducData: CreateProductDto) {
    return this.productsService.create(newProducData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: ProductListResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponseDto })
  findAll() {
    return this.productsService.findAll();
  }
}

