import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserRole } from './user';

export const createUserSchema = () => {
    const userSchema = new mongoose.Schema<IUser>({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER
        },
        createdAt: { type: Date, default: Date.now }
    });

    userSchema.pre("save", async function (next) {
        if(!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    });

    return userSchema;
};

export const createUserModel = (modelName = 'User') => {
    const schema = createUserSchema();
    return mongoose.model<IUser>(modelName, schema);
}; 