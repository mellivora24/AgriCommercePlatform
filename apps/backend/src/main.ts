import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { BigIntInterceptor } from '@/common/interceptors/bigint.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  console.log('ENV JWT:', process.env.JWT_SECRET);

  if (!process.env.JWT_SECRET) {
    console.warn(
      'Warning: JWT_SECRET is not set. Using default secret. This is not recommended for production.',
    );
  }

  app.useGlobalInterceptors(new BigIntInterceptor());

  await app.listen(3000);

  console.log(`Server is running on http://localhost:3000`);
}

bootstrap();
