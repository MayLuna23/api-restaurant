import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/winston.logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions), // Uso de logger en toda la API
  });

  app.setGlobalPrefix('api/v1/restaurant');

  // ✅ Habilita CORS para todos los orígenes
  app.enableCors({
    origin: '*', // Permitir todos los orígenes (solo en desarrollo)
  });

  // ✅ Validación global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
