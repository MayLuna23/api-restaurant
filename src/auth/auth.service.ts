import {
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { errorResponse, successResponse } from 'src/common/responses';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const method = 'validateUser';
    this.logger.log(
      `[AuthService][${method}] Validating user credentials for email: ${email}`,
    );
    try {
      const data = await this.usersService.findByEmail(email);
      if (!data) {
        throw new UnauthorizedException(
          errorResponse(401, 'Email or password is incorrect'),
        );
      }

      const isMatch = await bcrypt.compare(password, data.password);
      if (!isMatch) {
        throw new UnauthorizedException(
          errorResponse(401, 'Email or password is incorrect'),
        );
      }
      const payload = {
        sub: data.userId,
        name: data.name,
        role: data.role,
        email: data.email,
        createdAt: data.createdAt,
      };

      const jwtToken = await this.jwtService.signAsync(payload);

      return successResponse(
        {
          name: data.name,
          role: data.role,
          token: jwtToken,
        },
        200,
        'User authenticated successfully',
      );
    } catch (error) {
      this.logger.error(
        `[UsersService][${method}] Error searching for user with email ${email}: ${error.message}`,
        error.stack,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        errorResponse(500, 'Error generating token', error.message),
      );
    }
  }
}
