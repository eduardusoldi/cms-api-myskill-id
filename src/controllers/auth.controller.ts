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
      if (!String(username).trim() || !String(password).trim()) {
        throw new AppError('Username and password are required', 400);
      }

      const user = await User.findOne({ username });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isValidPassword = await bcrypt.compare(String(password), user.password);
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      const access_token = jwt.sign(
        { id: user._id, username: user.username },
        SECRET,
        { expiresIn: '1h' }
      );

      res.json({ access_token });
    } catch (err) {
      next(err);
    }
  }

  static logout(_req: Request, res: Response): void {
    res.json({
      message: 'Logout successful. Please clear the access_token on the client side (e.g. localStorage).'
    });
  }

}
