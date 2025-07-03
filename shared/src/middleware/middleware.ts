/**
 * Common Express middleware for microservices
 * Provides security, CORS, rate limiting, and other essential middleware
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';
import { EnvironmentConfig } from '@/types/common';
import { RateLimitConfig, CorsConfig, HelmetConfig } from '@/types/security';
import { logger } from '@/utils/logger';

/**
 * Creates rate limiting middleware
 */
const createRateLimiter = (config: Partial<RateLimitConfig> = {}): RateLimitRequestHandler => {
  const defaultConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  };

  return rateLimit({ ...defaultConfig, ...config });
};

/**
 * Creates CORS middleware
 */
const createCorsMiddleware = (config: Partial<CorsConfig> = {}): cors.CorsOptions => {
  const defaultConfig: CorsConfig = {
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400, // 24 hours
  };

  return { ...defaultConfig, ...config };
};

/**
 * Creates helmet security middleware configuration
 */
const createHelmetConfig = () => ({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" as const },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' as const },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' as const },
  xssFilter: true,
});

/**
 * Creates and configures Express middleware
 * @param app Express application instance
 * @param config Environment configuration
 * @returns Configured Express app
 */
export const configureMiddleware = (
  app: express.Application,
  config: EnvironmentConfig
): express.Application => {
  // Security middleware
  app.use(helmet(createHelmetConfig()));

  // CORS configuration
  const corsOptions = createCorsMiddleware({
    origin: config.CORS_ORIGIN.length > 0 ? config.CORS_ORIGIN : true,
  });
  app.use(cors(corsOptions));

  // Rate limiting
  const rateLimiter = createRateLimiter({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
  });
  app.use(rateLimiter);

  // Compression middleware
  app.use(compression());

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Security middleware
  app.use(mongoSanitize()); // Prevent NoSQL injection
  app.use(hpp()); // Prevent HTTP Parameter Pollution

  // Logging middleware
  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Request logging middleware
  app.use((req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.logRequest(req.method, req.path, res.statusCode, duration, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestId: req.headers['x-request-id'] as string,
      });
    });

    next();
  });

  return app;
};

/**
 * Creates a basic Express application with all middleware configured
 * @param config Environment configuration
 * @returns Configured Express application
 */
export const createApp = (config: EnvironmentConfig): express.Application => {
  const app = express();
  return configureMiddleware(app, config);
};

// Export middleware functions for individual use
export { createRateLimiter, createCorsMiddleware, createHelmetConfig }; 