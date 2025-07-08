import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
