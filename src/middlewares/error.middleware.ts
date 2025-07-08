import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError';

export const errorHandler: ErrorRequestHandler = function (
  err,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    res.status(400).json({ message: `Invalid ID format: ${err.value}` });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ message: 'Invalid access token. Please log in again.' });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    return;
  }

  // fallback
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Something went wrong. Please try again later.',
  });
};
