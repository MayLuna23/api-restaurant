import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'An internal error occurred', description: 'Error message' })
  message: string;

  @ApiPropertyOptional({
    example: { email: 'Email must be valid' },
    description: 'Optional field with error details',
  })
  errors?: any;
}
