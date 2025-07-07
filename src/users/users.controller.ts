import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a new user
  // This endpoint is protected by JWT authentication and roles guard
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() newUserData: CreateUserDto) {
    return this.usersService.create(newUserData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

}
