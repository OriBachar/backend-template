# NestJS Backend Template

A production-ready NestJS backend template with comprehensive authentication, AWS integration, security middleware, and extensive testing coverage.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (User/Admin roles)
- **Passport.js integration** with local and JWT strategies
- **Secure password hashing** with bcryptjs
- **Token refresh mechanism**

### ☁️ AWS Integration
- **EC2 instance management** (create, describe, terminate)
- **S3 file operations** (upload, download, delete)
- **Mock AWS service** for testing without real credentials
- **AWS SDK v3** with TypeScript support

### 🛡️ Security Features
- **Helmet.js** security headers
- **CORS configuration** with whitelist
- **Rate limiting** (100 requests per 15 minutes per IP)
- **MongoDB injection protection** with sanitization
- **HTTP Parameter Pollution** protection
- **Input validation** with class-validator
- **Request logging** with Morgan

### 🏗️ Architecture
- **Modular design** with feature-based modules
- **Dependency injection** with NestJS IoC container
- **Global exception handling** with custom filters
- **Response transformation** with interceptors
- **Environment-based configuration**
- **TypeScript** with strict type checking

### 🧪 Testing
- **Unit tests** for services and controllers with mocked dependencies
- **Integration tests** with real database operations and authentication flow
- **E2E tests** for complete API workflows
- **Mock AWS services** for testing without real credentials
- **Test coverage reporting**
- **Real authentication testing** with JWT tokens and password hashing
- **Test database isolation** with automatic cleanup between tests

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- AWS account (optional, for production)

## 🛠️ Installation

```bash
# Clone the repository
git clone 
cd backend-template

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure environment variables
# Edit .env file with your configuration
```

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
# Server Configuration
AUTH_SERVICE_PORT=3001
NODE_ENV=development
CORS_WHITELIST=http://localhost:3000,http://localhost:3001

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=backend_template

# Test Database Configuration (for integration tests)
# Create .env.test file with test-specific database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# AWS Configuration (optional for testing)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket
AWS_EC2_IMAGE_ID=ami-12345678
AWS_EC2_INSTANCE_TYPE=t2.micro
AWS_EC2_MIN_COUNT=1
AWS_EC2_MAX_COUNT=1
AWS_EC2_KEY_NAME=your-key-pair
AWS_EC2_SECURITY_GROUP_IDS=sg-12345678

# GitHub Configuration
GITHUB_REPO_URL=https://github.com/your-username/your-repo
```

## 🏃‍♂️ Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Unit tests only
npm run test:unit

# Integration tests only (requires MongoDB running)
npm run test:integration

# E2E tests only
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch

# Run specific test
npm run test:integration -- --testNamePattern="should login successfully"
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access-token>
```

### AWS EC2 Endpoints

#### Get All Instances
```http
GET /api/aws/ec2/instances
Authorization: Bearer <access-token>
```

#### Get Specific Instance
```http
GET /api/aws/ec2/instances/{instanceId}
Authorization: Bearer <access-token>
```

#### Create Instance
```http
POST /api/aws/ec2/create
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Test Instance",
  "instanceType": "t2.micro",
  "imageId": "ami-12345678",
  "minCount": 1,
  "maxCount": 1
}
```

#### Terminate Instance
```http
POST /api/aws/ec2/terminate
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "instanceId": "i-1234567890abcdef0"
}
```

### AWS S3 Endpoints

#### Upload File
```http
POST /api/aws/s3/upload
Authorization: Bearer <access-token>
Content-Type: multipart/form-data

file: <file>
key: "path/to/file.txt"
```

#### Download File
```http
GET /api/aws/s3/download/{key}
Authorization: Bearer <access-token>
```

## 🏗️ Project Structure

```
backend-template/
├── src/                                    # Source code directory
│   ├── common/                            # Shared utilities and decorators
│   │   ├── decorators/                    # Custom decorators
│   │   │   ├── roles.decorator.ts         # Role-based access control decorator
│   │   │   └── user.decorator.ts          # User extraction from JWT decorator
│   │   ├── filters/                       # Exception filters
│   │   │   └── http-exception.filter.ts   # Global exception handling filter
│   │   ├── guards/                        # Authentication guards
│   │   │   ├── jwt-auth.guard.ts          # JWT authentication guard
│   │   │   ├── local-auth.guard.ts        # Local strategy authentication guard
│   │   │   └── roles.guard.ts             # Role-based authorization guard
│   │   ├── interceptors/                  # Response interceptors
│   │   │   └── transform.interceptor.ts   # Response transformation interceptor
│   │   └── utils/                         # Utility functions
│   │       └── mongo-sanitize.util.ts     # MongoDB injection protection utility
│   ├── config/                            # Configuration files
│   │   ├── aws.ts                         # AWS SDK v3 client configuration
│   │   ├── database.ts                    # MongoDB connection configuration
│   │   ├── env.ts                         # Environment variables loader
│   │   └── security.ts                    # Security middleware configuration
│   ├── controllers/                       # API controllers (REST endpoints)
│   │   ├── app.controller.ts              # Health check and basic app endpoints
│   │   ├── auth.controller.ts             # Authentication endpoints (login, register, etc.)
│   │   └── aws.controller.ts              # AWS service endpoints (EC2, S3)
│   ├── dto/                               # Data Transfer Objects (request/response validation)
│   │   ├── auth.dto.ts                    # Authentication DTOs (login, register, refresh)
│   │   └── aws.dto.ts                     # AWS service DTOs (EC2, S3 operations)
│   ├── modules/                           # Feature modules (NestJS modules)
│   │   ├── app.module.ts                  # Root application module
│   │   ├── auth.module.ts                 # Authentication module
│   │   ├── aws.module.ts                  # AWS services module
│   │   └── users.module.ts                # User management module
│   ├── schemas/                           # MongoDB schemas (Mongoose models)
│   │   └── user.schema.ts                 # User model with password hashing
│   ├── services/                          # Business logic services
│   │   ├── app.service.ts                 # Application service
│   │   ├── auth.service.ts                # Authentication business logic
│   │   ├── aws.service.ts                 # AWS operations service
│   │   └── users.service.ts               # User management service
│   ├── strategies/                        # Passport.js authentication strategies
│   │   ├── jwt.strategy.ts                # JWT token validation strategy
│   │   └── local.strategy.ts              # Local username/password strategy
│   ├── types/                             # TypeScript type definitions
│   │   ├── auth.ts                        # Authentication related types
│   │   ├── ec2InstanceParams.ts           # EC2 instance parameter types
│   │   ├── error.ts                       # Error handling types
│   │   ├── uploadParams.ts                # File upload parameter types
│   │   └── user.ts                        # User related types
│   └── main.ts                            # Application entry point with security middleware
├── test/                                  # Test directory
│   ├── unit/                              # Unit tests (isolated component testing)
│   │   └── auth.service.spec.ts           # Auth service unit tests
│   ├── integration/                       # Integration tests (API endpoint testing)
│   │   ├── auth.controller.spec.ts        # Auth controller integration tests
│   │   └── aws.controller.spec.ts         # AWS controller integration tests
│   ├── mocks/                             # Mock services for testing
│   │   └── aws.service.mock.ts            # Mock AWS service (no real AWS needed)
│   ├── app.e2e-spec.ts                    # End-to-end application tests
│   ├── jest-e2e.json                      # E2E test configuration
│   ├── jest-integration.json              # Integration test configuration
│   └── jest-integration.setup.ts          # Integration test setup and utilities
├── dist/                                  # Compiled JavaScript output (generated)
├── node_modules/                          # Dependencies (generated)
├── .dockerignore                          # Docker ignore file
├── .env.example                           # Environment variables template
├── .gitignore                             # Git ignore file
├── .prettierrc                            # Prettier code formatting configuration
├── docker-compose.yml                     # Docker Compose configuration
├── Dockerfile                             # Docker container configuration
├── eslint.config.mjs                      # ESLint code linting configuration
├── nest-cli.json                          # NestJS CLI configuration
├── package.json                           # Project dependencies and scripts
├── package-lock.json                      # Dependency lock file
├── README.md                              # Project documentation
├── tsconfig.json                          # TypeScript configuration
├── tsconfig.build.json                    # TypeScript build configuration
└── jest.config.js                         # Jest test runner configuration
```

### 📁 Key Directories Explained

#### `src/common/` - Shared Utilities
- **decorators/**: Custom decorators for extracting user info and role-based access
- **filters/**: Global exception handling and error response formatting
- **guards/**: Authentication and authorization middleware
- **interceptors/**: Response transformation and logging
- **utils/**: Reusable utility functions (MongoDB sanitization, etc.)

#### `src/config/` - Configuration Management
- **aws.ts**: AWS SDK v3 client setup with credentials
- **database.ts**: MongoDB connection and configuration
- **env.ts**: Environment variable loading and validation
- **security.ts**: Security middleware configuration (Helmet, CORS, Rate Limiting)

#### `src/controllers/` - API Endpoints
- **app.controller.ts**: Health checks and basic application endpoints
- **auth.controller.ts**: Authentication endpoints (register, login, logout, refresh)
- **aws.controller.ts**: AWS service endpoints (EC2 instances, S3 file operations)

#### `src/dto/` - Data Validation
- **auth.dto.ts**: Request/response validation for authentication operations
- **aws.dto.ts**: Request/response validation for AWS operations

#### `src/modules/` - Feature Modules
- **app.module.ts**: Root module that imports all feature modules
- **auth.module.ts**: Authentication module with JWT and Passport configuration
- **aws.module.ts**: AWS services module with EC2 and S3 clients
- **users.module.ts**: User management module with MongoDB integration

#### `src/schemas/` - Database Models
- **user.schema.ts**: User model with password hashing and validation

#### `src/services/` - Business Logic
- **app.service.ts**: Application-level business logic
- **auth.service.ts**: Authentication logic (JWT, password validation)
- **aws.service.ts**: AWS operations (EC2, S3) with error handling
- **users.service.ts**: User management operations

#### `src/strategies/` - Authentication Strategies
- **jwt.strategy.ts**: JWT token validation strategy
- **local.strategy.ts**: Username/password authentication strategy

#### `test/` - Testing Infrastructure
- **unit/**: Isolated component tests with mocked dependencies
- **integration/**: API endpoint tests with real database operations and authentication
- **mocks/**: Mock services for testing without external dependencies
- **e2e/**: End-to-end tests for complete application workflows
- **jest-integration.setup.ts**: Integration test setup with environment configuration

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Environment Variables

The application uses different environment configurations:

- **Development**: `.env` (default)
- **Test**: `.env.test` (for integration tests with separate test database)
- **Production**: Environment variables or `.env.production`

**Note**: Integration tests require a running MongoDB instance and a `.env.test` file with test-specific configuration.

### Adding New Features

1. Create a new module in `src/modules/`
2. Add controllers in `src/controllers/`
3. Add services in `src/services/`
4. Add DTOs in `src/dto/`
5. Add tests in `test/unit/` and `test/integration/`

## 🐳 Docker

```bash
# Build image
docker build -t backend-template .

# Run container
docker run -p 3001:3001 backend-template

# Using docker-compose
docker-compose up -d
```

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set strong JWT secret
4. Configure AWS credentials (if using AWS features)
5. Set up CORS whitelist for production domains

### Deployment Options

- **Docker**: Use the provided Dockerfile
- **AWS**: Deploy to EC2, ECS, or Lambda
