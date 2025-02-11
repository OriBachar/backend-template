import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { AppError } from '../../types/error';

export const createRepository = <T extends Document>(model: Model<T>) => {
    const create = async (data: Partial<T>): Promise<T> => {
        try {
            const document = new model(data);
            return await document.save();
        } catch (error) {
            throw new AppError('Failed to create document', 500, true, { error });
        }
    };

    const findById = async (id: string): Promise<T | null> => {
        try {
            return await model.findById(id);
        } catch (error) {
            throw new AppError('Failed to find document by id', 500, true, { error });
        }
    };

    const findOne = async (filter: FilterQuery<T>): Promise<T | null> => {
        try {
            return await model.findOne(filter);
        } catch (error) {
            throw new AppError('Failed to find document', 500, true, { error });
        }
    };

    const find = async (filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> => {
        try {
            return await model.find(filter, null, options);
        } catch (error) {
            throw new AppError('Failed to find documents', 500, true, { error });
        }
    };

    const update = async (id: string, updateData: UpdateQuery<T>): Promise<T | null> => {
        try {
            return await model.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new AppError('Failed to update document', 500, true, { error });
        }
    };

    const remove = async (id: string): Promise<T | null> => {
        try {
            return await model.findByIdAndDelete(id);
        } catch (error) {
            throw new AppError('Failed to delete document', 500, true, { error });
        }
    };

    return {
        create,
        findById,
        findOne,
        find,
        update,
        remove
    };
};
