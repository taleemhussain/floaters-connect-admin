import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 5000;
  await app.listen(port, '0.0.0.0');

  logger.log(`Floaters CONNECT Admin API listening on http://0.0.0.0:${port} (prefix /api)`);
}

bootstrap();
