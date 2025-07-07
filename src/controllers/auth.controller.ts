import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  static logout(_req: Request, res: Response): void {
    res.json({ message: 'Logged out (client must clear token)' });
  }
}
