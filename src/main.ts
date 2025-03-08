import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorInterceptor } from './interceptors/error';
import { ResponseInterceptor } from './interceptors/success';
import helmet from 'helmet';
import { LoggerService } from './logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for the Task Management system')
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT Authentication in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  const logger = app.get(LoggerService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new ErrorInterceptor(logger));
  app.use(helmet());

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log('Server listening on port - ', port);
  });
}
bootstrap();
