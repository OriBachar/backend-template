import mongoose, { Schema } from 'mongoose';
import { IRole } from '../types/user';

const roleSchema = new Schema<IRole>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export const Role = mongoose.model<IRole>('Role', roleSchema); 