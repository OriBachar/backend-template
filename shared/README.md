# @backend-template/shared

Shared library for microservices architecture. This package contains common types, utilities, middleware, and configurations that are shared across all microservices.

## Features

- **Type Definitions**: Common interfaces, enums, and types used across services
- **Error Handling**: Standardized error classes and error handling utilities
- **Validation**: Zod-based validation utilities with common schemas
- **Logging**: Centralized logging with different levels and context support
- **Async Handlers**: Express async route handler utilities
- **Event Types**: Message queue event interfaces for inter-service communication

## Installation

```bash
npm install @backend-template/shared
```

## Usage

### Importing Types

```typescript
import { 
  BaseEntity, 
  UserRole, 
  JWTPayload, 
  ApiResponse,
  AppError,
  ValidationError 
} from '@backend-template/shared';
```

### Using Utilities

```typescript
import { 
  asyncHandler, 
  validateData, 
  createValidationMiddleware,
  logger 
} from '@backend-template/shared';

// Async handler
const handler = asyncHandler(async (req, res) => {
  // Your async logic here
});

// Validation
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const validatedData = validateData(userSchema, req.body);

// Validation middleware
const validateUser = createValidationMiddleware(userSchema, 'body');

// Logging
logger.info('User created', { userId: '123', email: 'user@example.com' });
```

### Using Error Classes

```typescript
import { 
  AppError, 
  ValidationError, 
  NotFoundError 
} from '@backend-template/shared';

// Custom error
throw new AppError('Something went wrong', 500);

// Validation error
throw new ValidationError('Invalid input data');

// Not found error
throw new NotFoundError('User not found');
```

### Using Event Types

```typescript
import { 
  UserRegisteredEvent, 
  EventHandler 
} from '@backend-template/shared';

const handleUserRegistered: EventHandler<UserRegisteredEvent> = async (event) => {
  console.log('User registered:', event.data.userId);
};
```

## Path Mapping

The library uses TypeScript path mapping for clean imports:

```typescript
// Instead of relative imports
import { AppError } from '../../../shared/src/types/error';

// Use clean imports
import { AppError } from '@backend-template/shared';
```

## Available Exports

### Types

- **Common Types**: `BaseEntity`, `UserRole`, `JWTPayload`, `ApiResponse`, etc.
- **Error Types**: `AppError`, `ValidationError`, `NotFoundError`, etc.
- **Event Types**: `BaseEvent`, `UserRegisteredEvent`, `FileUploadedEvent`, etc.

### Utilities

- **Async Handlers**: `asyncHandler`, `createAsyncHandler`, `createServiceHandler`
- **Validation**: `validateData`, `createValidationMiddleware`, `createCommonSchemas`
- **Logging**: `logger`, `createLogger`, `LogLevel`

### Common Schemas

```typescript
import { createCommonSchemas } from '@backend-template/shared';

const schemas = createCommonSchemas();

// Use pre-built schemas
const userSchema = z.object({
  email: schemas.email,
  password: schemas.password,
  id: schemas.id
});
```

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Cleaning

```bash
npm run clean
```

## Contributing

When adding new types or utilities:

1. Add the new file to the appropriate directory
2. Export it from the corresponding index file
3. Update the main index file if needed
4. Update this README with usage examples

## License

MIT