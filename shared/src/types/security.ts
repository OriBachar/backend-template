/**
 * Security and authentication-specific types and interfaces
 */

import jwt from 'jsonwebtoken';
import { UserRole } from './common';

// JWT verification options interface
export interface JWTVerificationOptions {
  secret: string;
  algorithms: jwt.Algorithm[];
  ignoreExpiration?: boolean;
}

// Auth middleware configuration interface
export interface AuthMiddlewareConfig {
  requireAuth: boolean;
  allowedRoles?: UserRole[];
  tokenType?: 'access' | 'refresh';
}

// Rate limiting configuration interface
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

// CORS configuration interface
export interface CorsConfig {
  origin: string[] | boolean;
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

// Helmet configuration interface
export interface HelmetConfig {
  contentSecurityPolicy: {
    directives: Record<string, string[]>;
  };
  crossOriginEmbedderPolicy: boolean;
  crossOriginOpenerPolicy: boolean;
  crossOriginResourcePolicy: { policy: "same-site" | "same-origin" | "cross-origin" };
  dnsPrefetchControl: { allow: boolean };
  frameguard: { action: string };
  hidePoweredBy: boolean;
  hsts: { maxAge: number; includeSubDomains: boolean; preload: boolean };
  ieNoOpen: boolean;
  noSniff: boolean;
  referrerPolicy: { policy: string };
  xssFilter: boolean;
} 