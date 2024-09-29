// // import { NestFactory } from '@nestjs/core';
// // import { AppModule } from './app.module';
// // import { ConfigService } from '@nestjs/config';


// // async function bootstrap() {
// //   const app = await NestFactory.create(AppModule);
// //   await app.listen(3000);
// // }
// // bootstrap();

// import { HttpAdapterHost, NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
// import { RollbarLogger } from 'nestjs-rollbar';
// import { AllExceptionsFilter } from './exceptions/all.exception';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule,{cors:true});
//   const httpAdapter = app.get(HttpAdapterHost);

//   const rollbarLogger = app.get(RollbarLogger);
//   //app.useGlobalFilters(new GlobalRollbarExceptionFilter(rollbarLogger));

//   app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, rollbarLogger));
//   await app.listen(parseInt(app.get(ConfigService).get('port')));
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RollbarLogger } from 'nestjs-rollbar';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions/all.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const httpAdapter = app.get(HttpAdapterHost);

  const rollbarLogger = app.get(RollbarLogger);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, rollbarLogger));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Doctor Appointment API')
    .setDescription('API documentation for the Doctor Appointment system')
    .setVersion('1.0')
    .addBearerAuth() // To enable JWT token in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger available at /api

  const port = parseInt(app.get(ConfigService).get('port'), 10) || 3000;
  await app.listen(port);
}
bootstrap();
