import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

const HTTP_METHODS = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
] as const;

function attachBearerSecurity(document: OpenAPIObject): OpenAPIObject {
  const security = document.security ?? [{ bearer: [] }];

  for (const pathItem of Object.values(document.paths ?? {})) {
    if (!pathItem) {
      continue;
    }

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation && operation.security === undefined) {
        operation.security = security;
      }
    }
  }

  return document;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const openApi = new DocumentBuilder()
    .setTitle('Golden Raspberry API')
    .setDescription(
      'REST API for Golden Raspberry Award movies and producer win intervals.',
    )
    .setVersion('0.0.1')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  SwaggerModule.setup(
    'docs',
    app,
    attachBearerSecurity(SwaggerModule.createDocument(app, openApi)),
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  );

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
