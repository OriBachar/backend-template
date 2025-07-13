# Backend Template

## Overview
This project is a Node.js backend written in TypeScript, designed with a modular architecture for scalability and maintainability. It includes robust authentication, **multi-database support** (MongoDB & PostgreSQL), **advanced security features**, AWS service integration, and comprehensive error handling.

## Features
- 🔒 **Secure authentication** with JWT token rotation
- 🛡️ **Advanced input validation** with Zod
- 🗄️ **Multi-database support**: MongoDB (Mongoose) + PostgreSQL (Prisma)
- 🔐 **Enhanced security** with Argon2 password hashing
- ☁️ **AWS integration** ready (S3, EC2)
- 🔄 **Rate limiting** and CORS protection
- 🚦 **Comprehensive error handling** middleware
- 📝 **Request logging** with Morgan
- 🐳 **Docker and Docker Compose** support for easy deployment
- 📚 **Swagger API documentation**
- 🔐 **Advanced security headers** and CORS settings
- 🔄 **JWT token rotation** for enhanced security
- 🛡️ **HTTP Parameter Pollution** protection
- 🧹 **MongoDB sanitization**
- 🚫 **Rate limiting** for API protection
- 🏗️ **Type-safe database operations** with Prisma
- 🔄 **Database factory pattern** for easy switching

## Prerequisites
- **Node.js** (v16 or later recommended)
- **npm** or **yarn**
- **MongoDB** (for MongoDB mode)
- **PostgreSQL** (for PostgreSQL mode)
- **AWS account** (if AWS services are used)

## Installation
1. Install dependencies:
   ```sh
   npm install
   ```
2. Configure environment variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   CORS_WHITELIST=http://localhost:3000,https://yourdomain.com
   
   # Database Configuration
   DATABASE_TYPE=mongodb  # or 'postgresql'
   
   # MongoDB Configuration (when DATABASE_TYPE=mongodb)
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=backend-template
   
   # PostgreSQL Configuration (when DATABASE_TYPE=postgresql)
   DATABASE_URL=postgresql://username:password@localhost:5432/backend_template
   
   # Authentication
   JWT_SECRET=your_jwt_secret
   
   # Optional AWS Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET=your_s3_bucket
   
   # Github repo url
   GITHUB_REPO_URL=your_github_repo_url
   ```

## Database Setup

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Set `DATABASE_TYPE=mongodb` in your `.env`
3. Configure `MONGODB_URI` and `DB_NAME`

### PostgreSQL Setup
1. **Install PostgreSQL**:
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Create Database**:
   ```bash
   psql -U postgres
   CREATE DATABASE backend_template;
   \q
   ```

3. **Initialize Prisma**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with initial data
   npm run db:seed
   ```

4. **Set Environment**:
   ```env
   DATABASE_TYPE=postgresql
   DATABASE_URL=postgresql://username:password@localhost:5432/backend_template
   ```

## Running the Application

### Development Mode
```sh
npm run dev
```

### Building
```sh
npm run build
```

### Production
```sh
npm start
```

### Database Management
```sh
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Docker Setup
The application can be run using Docker and Docker Compose for easy deployment and development.

### Prerequisites
- Docker
- Docker Compose

### Running with Docker Compose
1. Build and start all services:
   ```sh
   docker-compose up --build
   ```

2. Run in detached mode (in the background):
   ```sh
   docker-compose up -d --build
   ```

3. Stop the services:
   ```sh
   docker-compose down
   ```

4. View logs:
   ```sh
   docker-compose logs -f
   ```

The application will be available at `http://localhost:3000`.

### Environment Variables
The following environment variables are automatically configured in the Docker environment:
- `NODE_ENV=production`
- `MONGODB_URI=mongodb://mongodb:27017/backend-template`

Additional environment variables can be added to the `docker-compose.yml` file as needed.

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/auth/login` | User login with JWT token rotation |
| POST   | `/api/auth/register` | User registration with Argon2 password hashing |
| POST   | `/api/auth/refresh` | Refresh JWT tokens |

## Project Structure
```
/src
  ├── config/           # Configuration files (AWS, database, environment variables)
  ├── controllers/      # Handles incoming requests and calls services
  ├── data-access/      # Database repositories and queries
  │   └── repositories/
  │       ├── userRepository.ts           # MongoDB repository
  │       ├── postgresqlUserRepository.ts # PostgreSQL repository
  │       └── userRepositoryFactory.ts    # Repository factory
  ├── middleware/       # Authentication, validation, and error handling
  ├── models/          # Database models (MongoDB)
  ├── routes/          # Express routes definitions
  ├── services/        # Business logic services
  ├── types/           # Type definitions
  ├── utils/           # Utility functions and helpers
  └── script/          # Database seeding scripts

/prisma
  └── schema.prisma    # PostgreSQL schema (Prisma)
```

## Database Features

### Multi-Database Support
The application supports both MongoDB and PostgreSQL with easy switching:

#### MongoDB (Mongoose)
- ✅ Document-based storage
- ✅ Flexible schema
- ✅ Built-in aggregation
- ✅ Mongoose ODM

#### PostgreSQL (Prisma)
- ✅ Relational database
- ✅ ACID compliance
- ✅ Complex queries
- ✅ Prisma ORM
- ✅ Type safety
- ✅ Advanced relationships

### Database Switching
Change your `.env` file to switch databases:

```env
# For MongoDB
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017
DB_NAME=backend-template

# For PostgreSQL
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://username:password@localhost:5432/backend_template
```

## Security Features
- 🔒 **JWT token rotation** with access and refresh tokens
- 🛡️ **Comprehensive security headers** using Helmet
- 🔄 **Rate limiting** for API protection
- 🚫 **CORS protection** with whitelist
- 🧹 **MongoDB sanitization**
- 🛡️ **HTTP Parameter Pollution** protection
- 🔐 **Argon2 password hashing**
- 🔒 **Secure cookie settings**
- 🚫 **XSS protection**
- 🔒 **Content Security Policy**
- 🛡️ **Strict CORS configuration**
- 🏗️ **Type-safe database operations**

## AWS Infrastructure

### S3 Service
The application uses Amazon S3 for file storage and management. The following operations are supported:

- File upload with public/private access control
- File deletion
- Generating signed URLs for temporary file access
- Bucket management

Example usage:

```typescript
import { uploadToS3, getSignedUrl } from "./awsService";

// Upload file
const fileUrl = await uploadToS3({
  file: fileBuffer,
  fileName: "example.jpg",
  contentType: "image/jpeg",
  bucketName: "your-bucket"
});

// Generate temporary access URL
const signedUrl = await getSignedUrl("your-bucket", "example.jpg", 3600);
```

### EC2 Deployment
The application can be automatically deployed to Amazon EC2 instances. The deployment process includes:

- Instance launch with customizable configurations
- Automatic setup of Node.js environment
- Application code deployment
- Environment configuration
- Instance management (start/stop/status monitoring)

Example deployment:

```typescript
import { deployEC2 } from "./script/deployEC2";

// Launch new EC2 instance with application
const instanceId = await deployEC2();
```

## Error Handling
The application includes a centralized error handling system with custom AppError class and detailed error messages.

## API Documentation
The API documentation is available at `/api-docs` when running the application in development mode. The documentation includes:

- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Security requirements
- Rate limiting information

To access the documentation:
1. Start the application in development mode
2. Open your browser and navigate to `http://localhost:3000/api-docs`

## Database Management

### Prisma Studio
View and edit your PostgreSQL database through Prisma Studio:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555`

### Database Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure your database is running
   - Check connection strings in `.env`
   - Verify database credentials

2. **Prisma Issues**
   - Run `npm run db:generate` after schema changes
   - Use `npm run db:push` for development
   - Use `npm run db:migrate` for production

3. **TypeScript Errors**
   - Run `npm run build` to check TypeScript
   - Ensure Prisma client is generated: `npm run db:generate`

## Contributing
When adding new models:

1. Update `prisma/schema.prisma` (for PostgreSQL)
2. Create corresponding repository in `src/data-access/repositories/`
3. Add to repository factory
4. Update seed script if needed
5. Test with both databases