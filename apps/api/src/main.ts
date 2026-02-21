import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    { bufferLogs: true },
  );

  // Graceful shutdown: handle SIGTERM/SIGINT cleanly in Kubernetes
  app.enableShutdownHooks();

  // Use pino logger
  app.useLogger(app.get(Logger));

  // CORS — allow browser clients; origin defaults to same-host, override via CORS_ORIGIN env
  const corsOrigin = process.env.CORS_ORIGIN ?? false;
  app.enableCors({ origin: corsOrigin, credentials: true });

  // Global input validation: strip unknown fields, auto-transform primitives
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // API prefix
  const apiPrefix = process.env.API_PREFIX ?? 'api';
  app.setGlobalPrefix(apiPrefix, { exclude: ['/healthz', '/readyz'] });

  // OpenAPI / Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Compliance Platform API')
    .setDescription('Cloud-Powered Regulatory Compliance Platform API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.PORT ?? '3001', 10);
  await app.listen(port, '0.0.0.0');
}

bootstrap();
