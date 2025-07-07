import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { config } from './config/config'; // Configuración desde variables de entorno

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: config.db.url,
        },
      },
    });
    this.logger.log(`PrismaService initialized with DB URL: ${config.db.url}`);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection established successfully');
    } catch (error) {
      this.logger.error(`Error connecting to the database: ${error.message}`, error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database connection closed');
    } catch (error) {
      this.logger.error('Error disconnecting from the database', error);
    }
  }
}
