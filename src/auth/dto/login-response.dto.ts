import { ApiProperty } from '@nestjs/swagger';

class dataUserResponse {
  @ApiProperty({ example: 'Mayra Luna' })
  name: string;

  @ApiProperty({ example: 'admin, waiter' })
  role: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT auth token ',
  })
  token: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 200, description: 'HTTP statusCode' })
  statusCode: number;

  @ApiProperty({
    example: 'User authenticated successfully',
    description: 'succesfull message',
  })
  message: string;


  @ApiProperty()
  data: dataUserResponse;
}
