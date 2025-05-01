import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { envs } from '@config/envs';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get environment variables
  const port = envs.port;
  const apiPrefix = envs.apiPrefix;
  const appName = envs.appName;

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

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`${appName} API documentation`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Aplicar tema oscuro
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
  };

  SwaggerModule.setup('docs', app, document, options);

  // Enable CORS
  app.enableCors();

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`API Documentation available at: http://localhost:${port}/docs`);
}

void bootstrap();
