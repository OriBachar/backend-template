# Project Name

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

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/auth/login` | User login |
| POST   | `/auth/register` | User registration |

## Project Structure
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── data-access/    # Database access layer
├── middleware/     # Express middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
└── utils/          # Utility functions

## Security Features
* Security Features
* Helmet for security headers
* Rate limiting
* CORS protection
* MongoDB sanitization
* HTTP Parameter Pollution protection
* JWT authentication
* Password hashing with bcrypt

## Error Handling
The application includes a centralized error handling system with custom AppError class.