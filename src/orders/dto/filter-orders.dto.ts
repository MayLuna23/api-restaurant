import {
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FilterOrdersDto {
  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid date in YYYY-MM-DD format' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid date in YYYY-MM-DD format' })
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minTotal must be a number' })
  @Min(0, { message: 'minTotal must be greater than or equal to 0' })
  minTotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'maxTotal must be a number' })
  @Min(0, { message: 'maxTotal must be greater than or equal to 0' })
  maxTotal?: number;
}
