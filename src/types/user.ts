import { Document } from 'mongoose';

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}

// MongoDB User Interface (extends Mongoose Document)
export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
}

// PostgreSQL User Interface (plain object)
export interface IPostgreSQLUser {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

// Generic User Interface for both databases
export interface IUserBase {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
}

// Union type for database-agnostic operations
export type User = IUser | IPostgreSQLUser | IUserBase;