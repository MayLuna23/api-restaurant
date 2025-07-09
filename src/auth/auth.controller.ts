import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { errorResponse } from 'src/common/responses';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginData: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginData.email,
      loginData.password,
    );
    if (!user)
      throw new UnauthorizedException(
        errorResponse(401, 'Email or password is incorrect'),
      );
    return user;
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  async verify(
    @Req()
    req: Request & {
      user: { name: string; email: string; role: string; id: number };
    },
  ) {
    const user = req.user;
    return {
      message: 'Token is valid',
      name: user['name'],
      email: user['email'],
      role: user['role'],
      id: user['id'],
    };
  }
}
