import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 'Burger' })
  name: string;

  @ApiProperty({ example: 12.5 })
  price: number;
}

export class OrderItemDto {
  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ type: ProductDto })
  product: ProductDto;
}
