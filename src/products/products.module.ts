import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [CacheModule.register()], 
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
