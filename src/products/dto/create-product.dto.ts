import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Classic Burger',
    description: 'Product name',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @ApiProperty({ example: 12.99, description: 'Product price in USD', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;
}
