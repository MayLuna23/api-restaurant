import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class SingleUserResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export class MultipleUsersResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Users found successfully' })
  message: string;

  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}
