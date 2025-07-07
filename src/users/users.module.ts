import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [CacheModule.register()], 
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService], // Esto nos permite usar UsersService en otros módulos
})
export class UsersModule {}
