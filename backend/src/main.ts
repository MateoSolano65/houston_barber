import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { envs } from '@config/envs';

import { setupSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get environment variables
  const port = envs.port;
  const apiPrefix = envs.apiPrefix;

  // Set global prefix
  app.setGlobalPrefix(apiPrefix);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);

  // Enable CORS
  app.enableCors();

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`API Documentation available at: http://localhost:${port}/docs`);
}

void bootstrap();
