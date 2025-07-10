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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { ErrorResponseDto } from 'src/common/error-response.dto';
import { UnauthorizedResponse, VerifyTokenResponse } from './dto/VerifyTokenResponse.dto';

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

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verify JWT Token',
    description: 'Validates the JWT and returns user data if the token is valid.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    type: VerifyTokenResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – Invalid or missing token',
    type: UnauthorizedResponse,
  })
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
