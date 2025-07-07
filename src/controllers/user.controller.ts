import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export class UserController {
  static async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async createUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, username, password } = req.body;
      const existing = await User.findOne({ username });

      if (existing) {
        throw new AppError('Username taken', 400);
      }

      const user = new User({ name, username, password });
      await user.save();

      res.status(201).json({ message: 'User created' });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (userId !== req.params.id) {
        throw new AppError('Forbidden', 403);
      }

      const { name, password } = req.body;
      const update: any = {};
      if (name) update.name = name;
      if (password) update.password = password;

      const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
      res.json({ message: 'User updated', user });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (userId !== req.params.id) {
        throw new AppError('Forbidden', 403);
      }

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (err) {
      next(err);
    }
  }
}
