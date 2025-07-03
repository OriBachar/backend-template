/**
 * Event types for message queue communication between microservices
 */

import { UserRole } from './common';

// Base event interface
export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: Date;
  version: string;
  source: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

// User-related events
export interface UserRegisteredEvent extends BaseEvent {
  eventType: 'user.registered';
  data: {
    userId: string;
    email: string;
    role: UserRole;
    createdAt: Date;
  };
}

export interface UserUpdatedEvent extends BaseEvent {
  eventType: 'user.updated';
  data: {
    userId: string;
    email?: string;
    role?: UserRole;
    updatedAt: Date;
    changes: Record<string, any>;
  };
}

export interface UserDeletedEvent extends BaseEvent {
  eventType: 'user.deleted';
  data: {
    userId: string;
    deletedAt: Date;
  };
}

export interface UserLoggedInEvent extends BaseEvent {
  eventType: 'user.logged_in';
  data: {
    userId: string;
    email: string;
    loginTime: Date;
    ip: string;
    userAgent: string;
  };
}

// Profile-related events
export interface ProfileCreatedEvent extends BaseEvent {
  eventType: 'profile.created';
  data: {
    userId: string;
    profileId: string;
    createdAt: Date;
  };
}

export interface ProfileUpdatedEvent extends BaseEvent {
  eventType: 'profile.updated';
  data: {
    userId: string;
    profileId: string;
    updatedAt: Date;
    changes: Record<string, any>;
  };
}

// File-related events
export interface FileUploadedEvent extends BaseEvent {
  eventType: 'file.uploaded';
  data: {
    userId: string;
    fileId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    bucketName: string;
    uploadedAt: Date;
  };
}

export interface FileDeletedEvent extends BaseEvent {
  eventType: 'file.deleted';
  data: {
    userId: string;
    fileId: string;
    fileName: string;
    bucketName: string;
    deletedAt: Date;
  };
}

// AWS-related events
export interface EC2InstanceLaunchedEvent extends BaseEvent {
  eventType: 'ec2.instance_launched';
  data: {
    userId: string;
    instanceId: string;
    instanceType: string;
    region: string;
    launchedAt: Date;
  };
}

export interface EC2InstanceStoppedEvent extends BaseEvent {
  eventType: 'ec2.instance_stopped';
  data: {
    userId: string;
    instanceId: string;
    stoppedAt: Date;
  };
}

// Notification events
export interface NotificationSentEvent extends BaseEvent {
  eventType: 'notification.sent';
  data: {
    userId: string;
    notificationId: string;
    type: 'email' | 'sms' | 'push';
    status: 'sent' | 'failed' | 'pending';
    sentAt: Date;
  };
}

export interface NotificationFailedEvent extends BaseEvent {
  eventType: 'notification.failed';
  data: {
    userId: string;
    notificationId: string;
    type: 'email' | 'sms' | 'push';
    error: string;
    failedAt: Date;
  };
}

// Service health events
export interface ServiceHealthEvent extends BaseEvent {
  eventType: 'service.health';
  data: {
    serviceName: string;
    status: 'healthy' | 'unhealthy';
    timestamp: Date;
    metrics: {
      cpu: number;
      memory: number;
      uptime: number;
    };
  };
}

// Union type for all events
export type MicroserviceEvent = 
  | UserRegisteredEvent
  | UserUpdatedEvent
  | UserDeletedEvent
  | UserLoggedInEvent
  | ProfileCreatedEvent
  | ProfileUpdatedEvent
  | FileUploadedEvent
  | FileDeletedEvent
  | EC2InstanceLaunchedEvent
  | EC2InstanceStoppedEvent
  | NotificationSentEvent
  | NotificationFailedEvent
  | ServiceHealthEvent;

// Event handler type
export type EventHandler<T extends BaseEvent = BaseEvent> = (event: T) => Promise<void>;

// Event subscription interface
export interface EventSubscription {
  eventType: string;
  handler: EventHandler;
  queue?: string;
  exchange?: string;
  routingKey?: string;
}

// Event publishing options
export interface EventPublishOptions {
  exchange?: string;
  routingKey?: string;
  persistent?: boolean;
  priority?: number;
  expiration?: number;
  correlationId?: string;
} 