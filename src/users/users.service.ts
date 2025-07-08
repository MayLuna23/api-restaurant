import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Cache } from 'cache-manager';
import { omit } from 'lodash';
import { errorResponse, successResponse } from 'src/common/responses';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  // Create a new user
  async create(newUserData: CreateUserDto) {
    const method = 'create';
    this.logger.log(
      `[UsersService][${method}] Creating new user: ${JSON.stringify({ ...newUserData, password: '***' })}`, // Exclude password from logs for security
    );

    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: newUserData.email },
      });
      if (existingUser) {
        this.logger.warn(
          `[UsersService][${method}] User with email ${newUserData.email} already exists`,
        );
        throw new ConflictException(
          errorResponse(
            409,
            'User already exists',
            `User with email ${newUserData.email} already exists`,
          ),
        );
      }

      const hashedPassword = await bcrypt.hash(newUserData.password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...newUserData,
          password: hashedPassword, // Hash the password before saving
        },
      });

      this.logger.log(
        `[UsersService][${method}] User created with id ${user.userId}`,
      );

      // Excluid password from the result for security
      const result = omit(user, ['password']);
      return successResponse(result, 201, 'User created successfully');
    } catch (error) {
      this.logger.error(
        `[UsersService][${method}] Error creating user: ${error.message}`,
        error.stack,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        errorResponse(500, 'Error creating user', error.message),
      );
    }
  }

  // Find all users with caching
  // This method checks the cache first and only queries the database if the cache is empty
  async findAll() {
    const method = 'findAll';
    const cacheKey = 'users:all';

    this.logger.log(
      `[UsersService][${method}] Checking cache for key "${cacheKey}"`,
    );

    try {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        this.logger.log(`[UsersService][${method}] Returning users from cache`);
        return cached;
      }

      this.logger.log(
        `[UsersService][${method}] Cache miss. Fetching from database...`,
      );

      const users = await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          userId: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      this.logger.log(
        `[UsersService][${method}] Fetched ${users.length} users. Caching result...`,
      );

      await this.cacheManager.set(cacheKey, users);

      return successResponse(users, 200, 'Users found successfully');
    } catch (error) {
      this.logger.error(
        `[UsersService][${method}] Error fetching users: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        errorResponse(500, 'Error fetching users', error.message),
      );
    }
  }

  async findByEmail(email: string) {
    const method = 'findByEmail';
    this.logger.log(
      `[UsersService][${method}] Searching for user with email ${email}`,
    );

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        this.logger.warn(
          `[UsersService][${method}] No user found with email ${email}`,
        );
        return null
      }

      this.logger.log(
        `[UsersService][${method}] User with email ${email} found`,
      );
      return user
    } catch (error) {
      this.logger.error(
        `[UsersService][${method}] Error searching for user with email ${email}: ${error.message}`,
        error.stack,
      );
      return null
    }
  }

  // Find a user by ID
  // This method retrieves a user by their ID and throws an error if not found
  // async findOne(id: number) {
  //   const method = 'findOne';
  //   this.logger.log(`[UsersService][${method}] Finding user with id ${id}`);

  //   try {
  //     const user = await this.prisma.user.findUnique({
  //       where: { userId: id },
  //       select: {
  //         userId: true,
  //         name: true,
  //         role: true,
  //         email: true,
  //         createdAt: true,
  //       },
  //     });

  //     if (!user) {
  //       this.logger.warn(
  //         `[UsersService][${method}] User with id ${id} not found`,
  //       );
  //       throw new NotFoundException(errorResponse(404, `User with id ${id} not found`));
  //     }

  //     this.logger.log(`[UsersService][${method}] User with id ${id} found`);

  //     return successResponse(user, 200, 'User found successfully');
  //   } catch (error) {
  //     this.logger.error(
  //       `[UsersService][${method}] Error finding user: ${error.message}`,
  //       error.stack,
  //     );
  //     throw new InternalServerErrorException(
  //       errorResponse(500, 'Error fetching user', error.message),
  //     );
  //   }
  // }
}
