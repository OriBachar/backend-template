/**
 * JWT verification middleware for microservices
 * Provides centralized JWT token verification across all services
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { 
  AuthenticationError, 
  AuthorizationError,
  AppError 
} from '@/types/error';
import { JWTPayload, UserRole } from '@/types/common';
import { EnvironmentConfig } from '@/types/common';
import { JWTVerificationOptions, AuthMiddlewareConfig } from '@/types/security';
import { logger } from '@/utils/logger';

/**
 * Extracts JWT token from request headers
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Verifies JWT token and returns decoded payload
 */
const verifyToken = (
  token: string, 
  secret: string, 
  options: Partial<JWTVerificationOptions> = {}
): JWTPayload => {
  try {
    const defaultOptions: JWTVerificationOptions = {
      secret,
      algorithms: ['HS256'],
      ignoreExpiration: false,
    };

    const verificationOptions = { ...defaultOptions, ...options };
    const decoded = jwt.verify(token, secret, verificationOptions) as unknown as JWTPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token');
    }
    throw new AuthenticationError('Token verification failed');
  }
};

/**
 * Checks if user has required role
 */
const checkRole = (userRole: UserRole, allowedRoles?: UserRole[]): boolean => {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No role restrictions
  }
  
  return allowedRoles.includes(userRole);
};

/**
 * Creates JWT verification middleware
 * @param config Environment configuration
 * @param options Auth middleware options
 * @returns Express middleware function
 */
export const verifyJWT = (
  config: EnvironmentConfig,
  options: Partial<AuthMiddlewareConfig> = {}
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        requireAuth = true,
        allowedRoles,
        tokenType = 'access'
      } = options;

      // Extract token from request
      const token = extractToken(req);
      
      if (!token) {
        if (requireAuth) {
          throw new AuthenticationError('Authorization token is required');
        }
        return next(); // Skip authentication if not required
      }

      // Verify token
      const decoded = verifyToken(token, config.JWT_SECRET);
      
      // Check token type
      if (decoded.type !== tokenType) {
        throw new AuthenticationError(`Invalid token type. Expected: ${tokenType}`);
      }

      // Check role permissions
      if (!checkRole(decoded.role, allowedRoles)) {
        throw new AuthorizationError('Insufficient permissions');
      }

      // Attach user information to request
      (req as any).user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        tokenType: decoded.type
      };

      // Log successful authentication
      logger.info('JWT verification successful', {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        path: req.path,
        method: req.method
      });

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AuthenticationError('Authentication failed'));
      }
    }
  };
};

/**
 * Creates optional JWT verification middleware (doesn't fail if no token)
 */
export const optionalJWT = (config: EnvironmentConfig) => {
  return verifyJWT(config, { requireAuth: false });
};

/**
 * Creates role-based authorization middleware
 */
export const requireRole = (roles: UserRole[]) => {
  return (config: EnvironmentConfig) => {
    return verifyJWT(config, { allowedRoles: roles });
  };
};

/**
 * Creates admin-only authorization middleware
 */
export const requireAdmin = (config: EnvironmentConfig) => {
  return verifyJWT(config, { allowedRoles: [UserRole.ADMIN] });
};

/**
 * Creates refresh token verification middleware
 */
export const verifyRefreshToken = (config: EnvironmentConfig) => {
  return verifyJWT(config, { tokenType: 'refresh' });
};

// Export default JWT verification middleware
export default verifyJWT; 