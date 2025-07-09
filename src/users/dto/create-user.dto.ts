import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Mayra Luna',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @ApiProperty({
    example: 'mayra@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'admin',
    description: 'User role, must be either "admin" or "waiter"',
    enum: ['admin', 'waiter'],
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  @IsIn(['admin', 'waiter'], { message: 'Role must be either admin or waiter' })
  role: string;

  @ApiProperty({
    example: 'P@ssword123',
    description: 'Password must include at least one letter, one number and one special character',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
    message:
      'Password must contain at least one letter, one number and one special character',
  })
  password: string;
}
