import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDto } from './order-item.dto';

class OrderUserDto {
  @ApiProperty({ example: 'Mayra Luna' })
  name: string;
}

export class OrderDto {
  @ApiProperty({ example: 1 })
  orderId: number;

  @ApiProperty({ example: 250 })
  total: number;

  @ApiProperty({ type: OrderUserDto })
  user: OrderUserDto;

  @ApiProperty({ type: [OrderItemDto] })
  OrderItem: OrderItemDto[];

  @ApiProperty({
    example: '2025-07-08T14:32:00.000Z',
    description: 'Order creation timestamp',
  })
  createdAt: string;
}

export class SingleOrderResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Order created successfully' })
  message: string;

  @ApiProperty({ type: OrderDto })
  data: OrderDto;
}

export class MultipleOrdersResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Orders fetched successfully' })
  message: string;

  @ApiProperty({ type: [OrderDto] })
  data: OrderDto[];
}
