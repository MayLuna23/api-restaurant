import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { SingleUserResponse, MultipleUsersResponse } from './dto/user-response.dto';
import { ErrorResponseDto } from 'src/common/error-response.dto';


@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Post()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Create a new user (admin only)' })
@ApiBody({ type: CreateUserDto })
@ApiResponse({ status: 201, description: 'User successfully created', type: SingleUserResponse })
@ApiResponse({ status: 400, description: 'Invalid input data' })
@ApiResponse({ status: 401, description: 'Unauthorized, JWT token is missing or invalid' })
@ApiResponse({ status: 403, description: 'Forbidden, insufficient role permissions' })
@ApiResponse({
  status: 409,
  description: 'User already exists',
  type: ErrorResponseDto,
})
create(@Body() newUserData: CreateUserDto) {
  return this.usersService.create(newUserData);
}


  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: MultipleUsersResponse })
  findAll() {
    return this.usersService.findAll();
  }
}


