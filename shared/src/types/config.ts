/**
 * Configuration-specific types and interfaces
 */

// Database connection options interface
export interface DatabaseOptions {
  maxPoolSize: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
  bufferCommands: boolean;
  autoIndex: boolean;
  autoCreate: boolean;
}

// Redis connection options interface
export interface RedisOptions {
  host: string;
  port: number;
  password?: string;
  db: number;
  retryDelayOnFailover: number;
  maxRetriesPerRequest: number;
  lazyConnect: boolean;
  keepAlive: number;
  family: number;
} 