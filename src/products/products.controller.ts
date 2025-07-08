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
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() newProducData: CreateProductDto) {
    return this.productsService.create(newProducData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.productsService.findAll();
  }

}
