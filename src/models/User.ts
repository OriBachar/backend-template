import mongoose from 'mongoose';
import { IUser, UserRole } from '../types/user';
import * as argon2 from 'argon2';

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await argon2.hash(this.password);

    this.updatedAt = new Date();

    next();
});

export const User = mongoose.model<IUser>('User', userSchema);