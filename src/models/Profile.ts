import mongoose, { Schema } from 'mongoose';
import { IProfile } from '../types/user';

const profileSchema = new Schema<IProfile>({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    preferences: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

export const Profile = mongoose.model<IProfile>('Profile', profileSchema); 