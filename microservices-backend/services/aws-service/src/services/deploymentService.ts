import { launchEC2Instance } from './ec2Service';
import { awsSettings } from '../config/aws';
import { config } from '../config/env';
import { EC2InstanceParams, EC2InstanceResult, AppError } from '@microservices-backend/shared-types';
import { getEnv } from '@microservices-backend/shared-config';

export interface DeploymentOptions {
    projectName?: string;
    environment?: string;
    customUserData?: string;
    tags?: Array<{ Key: string; Value: string }>;
}

export const deployToEC2 = async (options: DeploymentOptions = {}): Promise<EC2InstanceResult> => {
    try {
        const {
            projectName = 'Backend-Service',
            environment = config.server.env,
            customUserData,
            tags = []
        } = options;

        // Create user data script for deployment
        const userData = customUserData || createUserDataScript();

        // Prepare deployment parameters
        const deploymentParams: EC2InstanceParams = {
            ...awsSettings.ec2,
            userData: Buffer.from(userData).toString('base64'),
            tags: [
                {
                    Key: 'Name',
                    Value: projectName
                },
                {
                    Key: 'Environment',
                    Value: environment
                },
                {
                    Key: 'Service',
                    Value: 'microservices-backend'
                },
                {
                    Key: 'DeployedAt',
                    Value: new Date().toISOString()
                },
                ...tags
            ]
        };

        const result = await launchEC2Instance(deploymentParams);
        console.log(`Successfully deployed to EC2 instance: ${result.instanceId}`);
        
        return result;
    } catch (error) {
        throw new AppError('Failed to deploy to EC2', 500, true, { error });
    }
};

const createUserDataScript = (): string => {
    const mongoUri = getEnv('MONGODB_URI', false);
    const dbName = getEnv('DB_NAME', false);
    const jwtSecret = getEnv('JWT_SECRET', false);
    const awsAccessKeyId = getEnv('AWS_ACCESS_KEY_ID', false);
    const awsSecretAccessKey = getEnv('AWS_SECRET_ACCESS_KEY', false);
    const awsRegion = getEnv('AWS_REGION', false);
    const awsS3Bucket = getEnv('AWS_S3_BUCKET', false);

    return `#!/bin/bash
# Update system
yum update -y

# Install Node.js 18
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install Git
yum install -y git

# Install PM2 for process management
npm install -g pm2

# Create application directory
mkdir -p /app
cd /app

# Clone repository
git clone ${awsSettings.git.repoUrl} .

# Navigate to microservices backend
cd microservices-backend

# Install dependencies
npm install

# Build all services
npm run build

# Create environment file
cat > .env << EOL
NODE_ENV=${config.server.env}
PORT=3000
MONGODB_URI=${mongoUri}
DB_NAME=${dbName}
JWT_SECRET=${jwtSecret}
AWS_ACCESS_KEY_ID=${awsAccessKeyId}
AWS_SECRET_ACCESS_KEY=${awsSecretAccessKey}
AWS_REGION=${awsRegion}
AWS_S3_BUCKET=${awsS3Bucket}
CORS_WHITELIST=*
EOL

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: './services/auth-service/dist/server.js',
      instances: 1,
      env: {
        NODE_ENV: '${config.server.env}',
        PORT: 3001
      }
    },
    {
      name: 'user-service',
      script: './services/user-service/dist/server.js',
      instances: 1,
      env: {
        NODE_ENV: '${config.server.env}',
        PORT: 3002
      }
    },
    {
      name: 'aws-service',
      script: './services/aws-service/dist/server.js',
      instances: 1,
      env: {
        NODE_ENV: '${config.server.env}',
        PORT: 3003
      }
    }
  ]
};
EOL

# Start services with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Install and configure nginx as reverse proxy
yum install -y nginx

cat > /etc/nginx/conf.d/microservices.conf << EOL
upstream auth_service {
    server localhost:3001;
}

upstream user_service {
    server localhost:3002;
}

upstream aws_service {
    server localhost:3003;
}

server {
    listen 80;
    server_name _;

    location /api/v1/auth/ {
        proxy_pass http://auth_service/api/v1/;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
    }

    location /api/v1/users/ {
        proxy_pass http://user_service/api/v1/;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
    }

    location /api/v1/aws/ {
        proxy_pass http://aws_service/api/v1/;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
    }

    location /health {
        proxy_pass http://auth_service/health;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
    }
}
EOL

# Start nginx
systemctl enable nginx
systemctl start nginx

# Log deployment completion
echo "Deployment completed at $(date)" >> /var/log/deployment.log
`;
};

export const createCustomDeployment = async (
    userData: string,
    instanceParams?: Partial<EC2InstanceParams>,
    tags?: Array<{ Key: string; Value: string }>
): Promise<EC2InstanceResult> => {
    try {
        const deploymentParams: EC2InstanceParams = {
            ...awsSettings.ec2,
            ...instanceParams,
            userData: Buffer.from(userData).toString('base64'),
            tags: [
                {
                    Key: 'Name',
                    Value: 'Custom-Deployment'
                },
                {
                    Key: 'Environment',
                    Value: config.server.env
                },
                {
                    Key: 'DeployedAt',
                    Value: new Date().toISOString()
                },
                ...(tags || [])
            ]
        };

        return await launchEC2Instance(deploymentParams);
    } catch (error) {
        throw new AppError('Failed to create custom deployment', 500, true, { error });
    }
}; 