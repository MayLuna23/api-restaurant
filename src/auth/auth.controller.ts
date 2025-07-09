import { Controller, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { errorResponse } from 'src/common/responses';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { ErrorResponseDto } from 'src/common/error-response.dto';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
@HttpCode(200)
@ApiOperation({ summary: 'Login' })
@ApiBody({ type: LoginUserDto })
@ApiResponse({
  status: 200,
  description: 'Successful login, returns JWT',
  type: LoginResponseDto,
})
@ApiResponse({ 
  status: 401,
  description: 'Invalid credentials',
  type: ErrorResponseDto,
})
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

}

