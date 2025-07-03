/**
 * Environment configuration for microservices
 * Loads and validates environment variables with defaults
 */

import dotenv from 'dotenv';
import path from 'path';
import { EnvironmentConfig } from '@/types/common';
import { AppError } from '@/types/error';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Gets environment variable with validation
 */
const getEnvVar = (key: string, required = false, defaultValue?: string): string => {
  const value = process.env[key];
  
  if (required && !value) {
    throw new AppError(`Environment variable ${key} is required`, 500);
  }
  
  return value || defaultValue || '';
};

/**
 * Gets environment variable as number
 */
const getEnvVarAsNumber = (key: string, required = false, defaultValue = 0): number => {
  const value = getEnvVar(key, required);
  
  if (!value) return defaultValue;
  
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new AppError(`Environment variable ${key} must be a valid number`, 500);
  }
  
  return num;
};

/**
 * Gets environment variable as array
 */
const getEnvVarAsArray = (key: string, required = false, defaultValue: string[] = []): string[] => {
  const value = getEnvVar(key, required);
  
  if (!value) return defaultValue;
  
  return value.split(',').map(item => item.trim()).filter(Boolean);
};

/**
 * Gets environment variable as boolean
 */
const getEnvVarAsBoolean = (key: string, required = false, defaultValue = false): boolean => {
  const value = getEnvVar(key, required);
  
  if (!value) return defaultValue;
  
  return value.toLowerCase() === 'true' || value === '1';
};

/**
 * Validates environment configuration
 */
const validateConfig = (config: EnvironmentConfig): void => {
  const requiredFields = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
  ];

  for (const field of requiredFields) {
    if (!config[field as keyof EnvironmentConfig]) {
      throw new AppError(`Missing required environment variable: ${field}`, 500);
    }
  }

  // Validate NODE_ENV
  if (!['development', 'production', 'test'].includes(config.NODE_ENV)) {
    throw new AppError('NODE_ENV must be development, production, or test', 500);
  }

  // Validate PORT
  if (config.PORT < 1 || config.PORT > 65535) {
    throw new AppError('PORT must be between 1 and 65535', 500);
  }
};

/**
 * Creates environment configuration object
 */
export const createEnvironmentConfig = (): EnvironmentConfig => {
  const config: EnvironmentConfig = {
    NODE_ENV: getEnvVar('NODE_ENV', false, 'development') as 'development' | 'production' | 'test',
    PORT: getEnvVarAsNumber('PORT', false, 3000),
    DATABASE_URL: getEnvVar('DATABASE_URL', true),
    REDIS_URL: getEnvVar('REDIS_URL', false),
    RABBITMQ_URL: getEnvVar('RABBITMQ_URL', false),
    JWT_SECRET: getEnvVar('JWT_SECRET', true),
    JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', false, '15m'),
    CORS_ORIGIN: getEnvVarAsArray('CORS_ORIGIN', false, []),
    RATE_LIMIT_WINDOW_MS: getEnvVarAsNumber('RATE_LIMIT_WINDOW_MS', false, 15 * 60 * 1000),
    RATE_LIMIT_MAX: getEnvVarAsNumber('RATE_LIMIT_MAX', false, 100),
  };

  // Validate configuration
  validateConfig(config);

  return config;
};

// Create and export default configuration
export const config = createEnvironmentConfig();

// Export configuration getter for testing
export const getConfig = (): EnvironmentConfig => config;

// Export individual getters for convenience
export const getNodeEnv = (): string => config.NODE_ENV;
export const getPort = (): number => config.PORT;
export const getDatabaseUrl = (): string => config.DATABASE_URL;
export const getRedisUrl = (): string | undefined => config.REDIS_URL;
export const getRabbitMQUrl = (): string | undefined => config.RABBITMQ_URL;
export const getJwtSecret = (): string => config.JWT_SECRET;
export const getJwtExpiresIn = (): string => config.JWT_EXPIRES_IN;
export const getCorsOrigin = (): string[] => config.CORS_ORIGIN;
export const getRateLimitWindowMs = (): number => config.RATE_LIMIT_WINDOW_MS;
export const getRateLimitMax = (): number => config.RATE_LIMIT_MAX; 