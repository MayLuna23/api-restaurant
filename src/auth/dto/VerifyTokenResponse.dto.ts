import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenResponse {
  @ApiProperty({ example: 'Token is valid' })
  message: string;

  @ApiProperty({ example: 'Mayra Luna' })
  name: string;

  @ApiProperty({ example: 'mayra@example.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: string;

  @ApiProperty({ example: 1 })
  userId: number;
}


export class UnauthorizedResponse {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  message: string;
}