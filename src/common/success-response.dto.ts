import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Operation successful', description: 'Success message' })
  message: string;

  @ApiProperty({ description: 'Returned data object' })
  data: T;
}
