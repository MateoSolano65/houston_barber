import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { envs } from './envs';

import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

const appName = envs.appName;

const swaggerConfig = new DocumentBuilder()
  .setTitle(appName)
  .setDescription(`${appName} API documentation`)
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'bearer',
  )
  .addSecurityRequirements('bearer')
  .addGlobalResponse({ status: 401, description: 'Unauthorized' })
  .addGlobalResponse({ status: 404, description: 'Not Found' })
  .addGlobalResponse({ status: 403, description: 'Forbidden' })
  .addGlobalResponse({ status: 500, description: 'Internal Server Error' })

  .build();

// Aplicar tema oscuro
const theme = new SwaggerTheme();
const options = {
  explorer: true,
  customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
};

export const setupSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, options);
};
