# Backend Template

## Overview
This project is a Node.js backend written in TypeScript, designed with a modular architecture for scalability and maintainability. It includes authentication, database interactions, and AWS service integration.

## Features
- 🔒 Secure authentication using JWT
- 🛡️ Input validation with Zod
- 🗄️ MongoDB integration with Mongoose
- ☁️ AWS integration ready
- 🔄 Rate limiting and CORS protection
- 🚦 Error handling middleware
- 📝 Request logging with Morgan
- 🐳 Docker and Docker Compose support for easy deployment
- 📚 Swagger API documentation

## Prerequisites
- **Node.js** (v16 or later recommended)
- **npm** or **yarn**
- **MongoDB** (or the relevant database)
- **AWS account** (if AWS services are used)

## Installation
1. Install dependencies:
   ```sh
   npm install
   ```
2. Configure environment variables:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_uri
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   
   # Optional AWS Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET=your_s3_bucket
   
   # CORS Configuration
   CORS_WHITELIST=http://localhost:3000,https://yourdomain.com

   # Github repo url
   GITHUB_REPO_URL=your_github_repo_url
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

The application will be available at `http://localhost:3000`, and MongoDB will be accessible at `mongodb://localhost:27017`.

### Environment Variables
The following environment variables are automatically configured in the Docker environment:
- `NODE_ENV=production`
- `MONGODB_URI=mongodb://mongodb:27017/backend-template`

Additional environment variables can be added to the `docker-compose.yml` file as needed.

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/auth/login` | User login |
| POST   | `/auth/register` | User registration |

## Project Structure
```
/src
  ├── config/           # Configuration files (AWS, database, environment variables)
  ├── controllers/      # Handles incoming requests and calls services
  ├── data-access/      # Database repositories and queries
  ├── middleware/       # Authentication, validation, and error handling
  ├── models/          # Database models
  ├── routes/          # Express routes definitions
  ├── services/        # Business logic services
  ├── types/           # Type definitions
```

## Security Features
* Security Features
* Helmet for security headers
* Rate limiting
* CORS protection
* MongoDB sanitization
* HTTP Parameter Pollution protection
* JWT authentication
* Password hashing with bcrypt

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
The application includes a centralized error handling system with custom AppError class.

## API Documentation
The API documentation is available at `/api-docs` when running the application in development mode. The documentation includes:

- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses

To access the documentation:
1. Start the application in development mode
2. Open your browser and navigate to `http://localhost:3000/api-docs`
