import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { JwtPayload } from '../types/jwt'; 

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Authorization must be a Bearer token', 401, 'INVALID_AUTH_HEADER'));
  }

  const access_token = authHeader.split(' ')[1];

  if (!access_token) {
    return next(new AppError('Access denied. Please log in to continue.', 401, 'NO_TOKEN_PROVIDED'));
  }

  try {
    const decoded = jwt.verify(access_token, SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired. Please log in again.', 401, 'TOKEN_EXPIRED'));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN'));
    }

    return next(new AppError('Authentication failed.', 401, 'AUTHENTICATION_ERROR'));
  }
};
