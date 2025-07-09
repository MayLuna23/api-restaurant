import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 200, description: 'HTTP statusCode' })
  statusCode: number;

  @ApiProperty({ example: 'User authenticated successfully', description: 'succesfull message' })
  message: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT auth token ',
  })
  data: string;
}
