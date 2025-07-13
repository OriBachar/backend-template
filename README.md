# Backend Template

## Overview
This project is a Node.js backend written in TypeScript, designed with a modular architecture for scalability and maintainability. It includes robust authentication, **multi-database support** (MongoDB & PostgreSQL), **advanced user management** with roles and permissions, **enhanced security features**, AWS service integration, and comprehensive error handling.

## Features
- 🔒 **Secure authentication** with JWT token rotation
- 🛡️ **Advanced input validation** with Zod
- 🗄️ **Multi-database support**: MongoDB (Mongoose) + PostgreSQL (Prisma)
- 👥 **Advanced user management** with roles, permissions, and profiles
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
- 🔄 **Repository factory pattern** for database-agnostic operations
- 🏗️ **Modular repository architecture** with organized folder structure

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
4. Seed the database:
   ```bash
   npm run db:seed:mongo
   ```

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
   npm run db:seed:postgresql
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

# Seed databases
npm run db:seed:mongo      # MongoDB seeding
npm run db:seed:postgresql # PostgreSQL seeding
npm run db:seed            # Default: PostgreSQL seeding

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
- `DATABASE_TYPE=mongodb` (or `postgresql`)
- `MONGODB_URI=mongodb://mongodb:27017/backend-template`
- `POSTGRESQL_URL=postgresql://postgres:postgres@postgres:5432/backend-template`

Additional environment variables can be added to the `docker-compose.yml` file as needed.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/auth/login` | User login with JWT token rotation |
| POST   | `/api/auth/register` | User registration with Argon2 password hashing |
| POST   | `/api/auth/refresh` | Refresh JWT tokens |

### Roles Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | `/api/roles` | Get all roles |
| POST   | `/api/roles` | Create a new role |
| GET    | `/api/roles/:id` | Get role by ID |
| GET    | `/api/roles/name/:name` | Get role by name |
| PUT    | `/api/roles/:id` | Update role by ID |
| DELETE | `/api/roles/:id` | Delete role by ID |

### Permissions Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | `/api/permissions` | Get all permissions |
| POST   | `/api/permissions` | Create a new permission |
| GET    | `/api/permissions/:id` | Get permission by ID |
| GET    | `/api/permissions/name/:name` | Get permission by name |
| GET    | `/api/permissions/resource/:resource` | Get permissions by resource |
| PUT    | `/api/permissions/:id` | Update permission by ID |
| DELETE | `/api/permissions/:id` | Delete permission by ID |

### User Profiles Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | `/api/profiles` | Get all profiles |
| POST   | `/api/profiles` | Create a new profile |
| GET    | `/api/profiles/:id` | Get profile by ID |
| GET    | `/api/profiles/user/:userId` | Get profile by user ID |
| PUT    | `/api/profiles/:id` | Update profile by ID |
| PUT    | `/api/profiles/user/:userId` | Update profile by user ID |
| DELETE | `/api/profiles/:id` | Delete profile by ID |
| DELETE | `/api/profiles/user/:userId` | Delete profile by user ID |

## Advanced User Management

### Features
- 👥 **User Roles**: admin, user, moderator, premium
- 🔐 **Permissions**: Granular permissions for resources and actions
- 👤 **User Profiles**: Extended user information and preferences
- 📊 **Audit Logs**: Track user actions and system events
- 🔄 **Sessions**: Manage user sessions and tokens

### Data Models
- **Users**: Core user authentication and role management
- **Roles**: Define user roles and their descriptions
- **Permissions**: Granular permissions for resources and actions
- **Profiles**: Extended user information and preferences
- **Sessions**: User session management
- **Audit Logs**: System activity tracking

### Sample Data
After seeding, you'll have:
- **Admin User**: admin@example.com / admin123
- **Regular User**: user@example.com / user123
- **Roles**: admin, user, moderator
- **Permissions**: user:read, user:write, admin:full, profile:read, profile:write

### API Usage Examples

#### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "password": "password123"}'
```

#### Roles Management
```bash
# Get all roles
curl -X GET http://localhost:3000/api/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create a new role
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "editor", "description": "Content editor role"}'

# Update a role
curl -X PUT http://localhost:3000/api/roles/ROLE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"description": "Updated description"}'
```

#### Permissions Management
```bash
# Get all permissions
curl -X GET http://localhost:3000/api/permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create a new permission
curl -X POST http://localhost:3000/api/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "content:edit", "description": "Edit content", "resource": "content", "action": "edit"}'

# Get permissions by resource
curl -X GET http://localhost:3000/api/permissions/resource/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### User Profiles Management
```bash
# Get all profiles
curl -X GET http://localhost:3000/api/profiles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create a profile
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"userId": "USER_ID", "firstName": "John", "lastName": "Doe", "bio": "Software developer"}'

# Update profile by user ID
curl -X PUT http://localhost:3000/api/profiles/user/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"firstName": "Jane", "bio": "Updated bio"}'
```

### Response Format
All API endpoints return a consistent response format:
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

### Error Handling
The API provides detailed error responses:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "isOperational": true
  }
}
```

## Project Structure
```
/src
  ├── config/           # Configuration files (AWS, database, environment variables)
  ├── controllers/      # Handles incoming requests and calls services
  │   ├── authController.ts
  │   ├── roleController.ts
  │   ├── permissionController.ts
  │   └── profileController.ts
  ├── data-access/      # Database repositories and queries
  │   └── repositories/
  │       ├── factories/           # Repository factory pattern
  │       │   ├── userRepositoryFactory.ts
  │       │   ├── roleRepositoryFactory.ts
  │       │   ├── permissionRepositoryFactory.ts
  │       │   └── profileRepositoryFactory.ts
  │       ├── mongo/              # MongoDB implementations
  │       │   ├── baseRepository.ts
  │       │   ├── userRepository.ts
  │       │   ├── roleRepository.ts
  │       │   ├── permissionRepository.ts
  │       │   └── profileRepository.ts
  │       └── postgresql/         # PostgreSQL implementations
  │           ├── postgresqlUserRepository.ts
  │           ├── postgresqlRoleRepository.ts
  │           ├── postgresqlPermissionRepository.ts
  │           └── postgresqlProfileRepository.ts
  ├── middleware/       # Authentication, validation, and error handling
  ├── models/          # Database models (MongoDB)
  │   ├── User.ts
  │   ├── Role.ts
  │   ├── Permission.ts
  │   └── Profile.ts
  ├── routes/          # Express routes definitions
  │   ├── authRoutes.ts
  │   ├── roleRoutes.ts
  │   ├── permissionRoutes.ts
  │   ├── profileRoutes.ts
  │   └── index.ts
  ├── services/        # Business logic services
  │   ├── authService.ts
  │   ├── roleService.ts
  │   ├── permissionService.ts
  │   ├── profileService.ts
  │   └── awsService.ts
  ├── types/           # Type definitions
  ├── utils/           # Utility functions and helpers
  └── script/          # Database seeding scripts
      ├── seed.mongo.ts
      └── seed.postgresql.ts

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
- ✅ Advanced user management models

#### PostgreSQL (Prisma)
- ✅ Relational database
- ✅ ACID compliance
- ✅ Complex queries
- ✅ Prisma ORM
- ✅ Type safety
- ✅ Advanced relationships
- ✅ Advanced user management with foreign keys

### Repository Factory Pattern
The application uses a factory pattern for database-agnostic operations:

```typescript
// Get the appropriate repository based on database type
const userRepository = UserRepositoryFactory.create();
const roleRepository = RoleRepositoryFactory.create();
const permissionRepository = PermissionRepositoryFactory.create();
const profileRepository = ProfileRepositoryFactory.create();
```

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

## Deployment

### EC2 Deployment
The application includes an EC2 deployment script that supports both databases:

```typescript
// The deployEC2 script automatically sets the correct environment variables
// based on your DATABASE_TYPE configuration
```

### Environment Variables for Deployment
The deployment script automatically configures:
- Database-specific environment variables
- Conditional setup based on `DATABASE_TYPE`
- Proper connection strings for both MongoDB and PostgreSQL

## Testing the API

### Swagger Documentation
When running in development mode, you can access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

This provides:
- Complete API endpoint documentation
- Interactive testing interface
- Request/response schemas
- Authentication requirements
- Example requests and responses

### Testing with curl
You can test the API endpoints using curl commands. First, authenticate to get a JWT token:

```bash
# Login and get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

Then use the returned token in subsequent requests:

```bash
# Test roles endpoint
curl -X GET http://localhost:3000/api/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Testing with Postman
1. Import the Swagger specification from `/api-docs`
2. Set up environment variables for the base URL
3. Use the authentication endpoints to get tokens
4. Test all CRUD operations for roles, permissions, and profiles

## Development Workflow

### Adding New Features
1. **Create Repository**: Add MongoDB and PostgreSQL implementations
2. **Create Service**: Add business logic with validation
3. **Create Controller**: Add request/response handling
4. **Create Routes**: Add API endpoints with Swagger docs
5. **Update Index**: Register new routes in `src/routes/index.ts`
6. **Test**: Use Swagger UI or curl to test endpoints

### Database Operations
```bash
# Switch between databases
export DATABASE_TYPE=mongodb    # or postgresql

# Seed databases
npm run db:seed:mongo          # MongoDB
npm run db:seed:postgresql     # PostgreSQL

# Generate Prisma client (PostgreSQL)
npm run db:generate

# Push schema changes (PostgreSQL)
npm run db:push
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License
This project is licensed under the MIT License.