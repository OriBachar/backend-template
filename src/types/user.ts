import { Document } from 'mongoose';

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
    MODERATOR = "moderator",
    PREMIUM = "premium"
}

// MongoDB User Interface (extends Mongoose Document)
export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// PostgreSQL User Interface (plain object)
export interface IPostgreSQLUser {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Generic User Interface for both databases
export interface IUserBase {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Union type for database-agnostic operations
export type User = IUser | IPostgreSQLUser | IUserBase;

// Enhanced User Profile Interface
export interface IProfile extends Document {
    _id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    preferences?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

// Role Interface
export interface IRole extends Document {
    _id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Permission Interface
export interface IPermission extends Document {
    _id: string;
    name: string;
    description?: string;
    resource: string;
    action: string;
    createdAt: Date;
    updatedAt: Date;
}

// Session Interface
export interface ISession {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

// Audit Log Interface
export interface IAuditLog {
    id: string;
    userId: string;
    action: string;
    resource?: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}