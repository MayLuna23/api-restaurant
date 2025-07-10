import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/winston.logger';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  app.setGlobalPrefix('api/v1/restaurant');
app.enableCors({
  origin: [
    'http://localhost:4000',
    'http://13.221.146.190:4000',
  ],
   methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const config = new DocumentBuilder()
    .setTitle('Ocean Restaurant API 🍽️🌊')
    .setDescription('Documentación de la API para gestión del restaurante Ocean')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
