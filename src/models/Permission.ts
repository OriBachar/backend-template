import mongoose, { Schema } from 'mongoose';
import { IPermission } from '../types/user';

const permissionSchema = new Schema<IPermission>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    resource: {
        type: String,
        required: true,
        trim: true
    },
    action: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Create compound index for resource and action
permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema); 