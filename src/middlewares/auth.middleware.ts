import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError'; // Adjust path if needed

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface JwtPayload {
  id: string;
  username: string;
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Authorization must be a Bearer token', 401));
  }

  const access_token = authHeader?.split(' ')[1];

  if (!access_token) {
    return next(new AppError('Access denied. Please log in to continue.', 401));
  }

  try {
    const decoded = jwt.verify(access_token, SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
