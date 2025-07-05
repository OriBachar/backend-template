import { Router } from 'express';
// import multer from 'multer';

// Controllers
import {
    uploadFile,
    deleteFile,
    getSignedUrl,
    listFiles,
    getS3Health
} from '../controllers/s3Controller';

import {
    createInstance,
    stopInstance,
    startInstance,
    terminateInstance,
    getInstanceStatus,
    getAllInstances,
    getEC2Health
} from '../controllers/ec2Controller';

import {
    deployApplication,
    createCustomDeploy
} from '../controllers/deploymentController';

// Validators
import {
    validateUploadFile,
    validateDeleteFile,
    validateSignedUrl,
    validateEC2Instance,
    validateInstanceId,
    validateDeployment
} from '../middleware/validators';

const router = Router();

// Configure multer for file uploads (will be enabled after dependencies are installed)
// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 10 * 1024 * 1024 // 10MB limit
//     }
// });

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        service: 'aws-service',
        message: 'AWS service is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.AWS_SERVICE_PORT || 3003
    });
});

// S3 Routes
router.post('/s3/upload', uploadFile);
router.delete('/s3/delete', validateDeleteFile, deleteFile);
router.post('/s3/signed-url', validateSignedUrl, getSignedUrl);
router.get('/s3/list', listFiles);
router.get('/s3/health', getS3Health);

// EC2 Routes
router.post('/ec2/instances', validateEC2Instance, createInstance);
router.post('/ec2/instances/:instanceId/stop', validateInstanceId, stopInstance);
router.post('/ec2/instances/:instanceId/start', validateInstanceId, startInstance);
router.delete('/ec2/instances/:instanceId', validateInstanceId, terminateInstance);
router.get('/ec2/instances/:instanceId', validateInstanceId, getInstanceStatus);
router.get('/ec2/instances', getAllInstances);
router.get('/ec2/health', getEC2Health);

// Deployment Routes
router.post('/deploy', validateDeployment, deployApplication);
router.post('/deploy/custom', createCustomDeploy);

// General AWS Health Check
router.get('/aws/health', async (req, res) => {
    try {
        const { checkS3Health } = await import('../services/s3Service');
        const { checkEC2Health } = await import('../services/ec2Service');
        
        const [s3Health, ec2Health] = await Promise.all([
            checkS3Health(),
            checkEC2Health()
        ]);

        const isHealthy = s3Health && ec2Health;

        res.status(isHealthy ? 200 : 503).json({
            status: isHealthy ? 'success' : 'error',
            message: `AWS services are ${isHealthy ? 'healthy' : 'partially unhealthy'}`,
            data: {
                s3: s3Health,
                ec2: ec2Health,
                overall: isHealthy
            }
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: 'Failed to check AWS services health',
            data: {
                s3: false,
                ec2: false,
                overall: false
            }
        });
    }
});

export default router; 