import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 'Classic Burger' })
  name: string;

  @ApiProperty({ example: 12.99 })
  price: number;

  @ApiProperty({ example: '2025-07-08T14:20:00.000Z' })
  createdAt: string;
}

export class SingleProductResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Product created successfully' })
  message: string;

  @ApiProperty({ type: ProductDto })
  data: ProductDto;
}

export class ProductListResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Products found successfully' })
  message: string;

  @ApiProperty({ type: [ProductDto] })
  data: ProductDto[];
}
