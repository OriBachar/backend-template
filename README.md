# Microservices Backend Platform

This project transforms a monolithic backend into a microservices architecture using industry-standard practices.

## 🏗️ Architecture Overview

```
microservices-backend/
├── services/                # Microservices
│   ├── auth-service/        # Authentication & JWT management
│   ├── user-service/        # User profile management  
│   ├── aws-service/         # AWS S3/EC2 operations
│   └── api-gateway/         # API Gateway & routing
├── packages/                # Shared NPM packages
│   ├── shared-types/        # TypeScript interfaces & types
│   ├── shared-utils/        # Utility functions
│   ├── shared-events/       # Event system (Redis)
│   └── shared-config/       # Configuration utilities
```

## 📦 Shared Packages

### @microservices-backend/shared-types
Contains all TypeScript interfaces and types:
- **Auth types**: Login, register, JWT schemas
- **User types**: User interface, roles, enums
- **AWS types**: S3 upload, EC2 instance parameters
- **Common types**: API responses, errors, pagination

### @microservices-backend/shared-utils  
Contains utility functions:
- **Async handler**: Express async error handling
- **Validation utilities**: Zod validation helpers
- **Crypto utilities**: JWT, bcrypt helpers (planned)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (via Docker)
- Redis (via Docker)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   npm run bootstrap
   ```

2. **Build shared packages:**
   ```bash
   npm run build
   ```

3. **Start development environment:**
   ```bash
   npm run dev
   ```

## 🔧 Development Commands

```bash
# Install all dependencies
npm run bootstrap

# Build all packages and services
npm run build

# Start development environment
npm run dev

# Stop all services
npm run stop

# View logs
npm run logs

# Clean build artifacts
npm run clean
```

## 🎯 Next Steps

1. **Extract Auth Service** - Move authentication logic to dedicated service
2. **Extract User Service** - Move user management to dedicated service
3. **Extract AWS Service** - Move AWS operations to dedicated service  
4. **Create API Gateway** - Set up routing and middleware
5. **Docker Compose** - Container orchestration for development
6. **Testing** - Integration and E2E tests

## 🛠️ Technology Stack

- **Framework**: Express.js + TypeScript
- **Database**: MongoDB with Mongoose
- **Message Queue**: Redis
- **Authentication**: JWT with rotation
- **Validation**: Zod
- **Containerization**: Docker + Docker Compose
- **Monorepo**: NPM Workspaces


## 🔒 Security Features

- JWT token rotation
- Input validation with Zod
- Request rate limiting  
- CORS protection
- Helmet security headers
- MongoDB sanitization