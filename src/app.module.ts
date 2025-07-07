import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register(), UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
