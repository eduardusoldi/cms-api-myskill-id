import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Custom application error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Mongoose invalid ObjectId error
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      message: `Invalid ID format: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid access token. Please log in again.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Your session has expired. Please log in again.',
    });
  }

  // Fallback for unhandled errors
  console.error('Unhandled error:', err);
  return res.status(500).json({
    message: 'Something went wrong on our end. Please try again later.',
  });
};
