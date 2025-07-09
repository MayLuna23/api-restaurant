import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/winston.logger';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


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

    const config = new DocumentBuilder()
    .setTitle('Ocean Restaurant API 🍽️🌊')
    .setDescription('Documentación de la API para gestión del restaurante Ocean')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // URL: http://localhost:3000/docs


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
