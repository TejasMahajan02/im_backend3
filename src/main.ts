import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.NODE_ORIGIN,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // strips any properties not defined in the DTO
    forbidNonWhitelisted: true, // throws an error if extra properties are present
  }));

  // npm install --save @nestjs/swagger
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.NODE_PORT);
}
bootstrap();
