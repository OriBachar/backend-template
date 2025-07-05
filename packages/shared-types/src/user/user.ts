import { Document } from 'mongoose';

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
} 