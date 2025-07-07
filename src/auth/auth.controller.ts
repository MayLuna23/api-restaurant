import { Controller, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { errorResponse } from 'src/common/responses';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginData: LoginUserDto) {
    const user = await this.authService.validateUser(loginData.email, loginData.password);
    if (!user) throw new UnauthorizedException(errorResponse(401, 'Email or password is incorrect'));
    return user;
  }
}
