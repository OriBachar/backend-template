import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import { getSecurityConfig } from './config/security';

// Security middleware imports
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
const hpp = require('hpp');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // Get security configuration
  const securityConfig = getSecurityConfig(configService);

  // Security middleware
  app.use(helmet(securityConfig.helmet));
  app.use(cors(securityConfig.cors));
  app.use(rateLimit(securityConfig.rateLimit));
  app.use(compression());
  app.use(hpp());

  // MongoDB sanitization middleware
  app.use((req, res, next) => {
    if (req.body) {
      req.body = mongoSanitize(req.body);
    }
    if (req.params) {
      req.params = mongoSanitize(req.params);
    }
    next();
  });

  // Logging middleware
  const env = configService.get<string>('server.env', 'development');
  app.use(morgan(env === 'development' ? 'dev' : 'combined'));

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Start the application
  const port = configService.get<number>('server.port', 3000);
  await app.listen(port);
  
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Environment: ${env}`);
  console.log(`🔒 Security middleware enabled`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
