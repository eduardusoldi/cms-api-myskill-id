import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';
import { AuthenticatedRequest } from '../types/express';

export class UserController {
  static async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().select('-password -__v');

      if (!users || users.length === 0) {
        throw new AppError('No users found', 404, 'NO_USERS_FOUND');
      }

      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new AppError('Invalid ID format', 400, 'INVALID_ID_FORMAT');
      }

      const user = await User.findById(req.params.id).select('-password -__v');
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async createUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new AppError('Request body cannot be empty.', 400, 'EMPTY_BODY');
      }
      const { name, username, password } = req.body;
      const errorMsg: string[] = [];

      if (!name || !String(name).trim()) errorMsg.push('Name is required');
      if (!username || !String(username).trim()) errorMsg.push('Username is required');
      if (!password || !String(password).trim()) errorMsg.push('Password is required');

      if (errorMsg.length > 0) throw new AppError(errorMsg.join('; '), 400, 'VALIDATION_ERROR');

      const existing = await User.findOne({ username: String(username).trim() });
      if (existing) throw new AppError('Username is already taken', 400, 'USERNAME_TAKEN');

      const user = new User({
        name: String(name).trim(),
        username: String(username).trim(),
        password: String(password).trim(),
      });

      await user.save();

      const { password: _, __v, ...userWithoutPassword } = user.toObject();
      res.status(201).json({
        message: 'User created successfully',
        user: userWithoutPassword,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new AppError('Request body cannot be empty.', 400, 'EMPTY_BODY');
      }
      const userId = req.user?.id;
      const paramId = req.params.id;

      if (userId !== paramId) {
        throw new AppError('You do not have permission to update this user.', 403, 'FORBIDDEN_UPDATE');
      }

      const { name, password, username } = req.body;

      const updateFields: any = {};
      if (name !== undefined) updateFields.name = String(name);
      if (username !== undefined) updateFields.username = String(username);
      if (password !== undefined) {
        const hashedPassword = await bcrypt.hash(String(password), 10);
        updateFields.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(paramId, updateFields, { new: true }).select('-password -__v');

      if (!updatedUser) {
        throw new AppError('User not found or could not be updated.', 404, 'UPDATE_FAILED');
      }

      res.json({
        message: 'User information updated successfully.',
        user: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const paramId = req.params.id;

      if (userId !== paramId) {
        throw new AppError('You do not have permission to delete this user.', 403, 'FORBIDDEN_DELETE');
      }

      const deletedUser = await User.findByIdAndDelete(paramId);

      if (!deletedUser) {
        throw new AppError('User not found or already deleted.', 404, 'DELETE_FAILED');
      }

      res.json({ message: 'Your account has been successfully deleted.' });
    } catch (err) {
      next(err);
    }
  }
}
