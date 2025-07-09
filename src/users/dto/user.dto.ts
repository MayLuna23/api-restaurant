import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1, description: 'Unique user ID' })
  userId: number;

  @ApiProperty({ example: 'Mayra Luna', description: 'Full name of the user' })
  name: string;

  @ApiProperty({ example: 'mayra@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'admin', description: 'User role: admin or waiter' })
  role: string;

  @ApiProperty({
    example: '2025-07-08T12:34:56.789Z',
    description: 'Date when the user was created',
  })
  createdAt: string;
}
