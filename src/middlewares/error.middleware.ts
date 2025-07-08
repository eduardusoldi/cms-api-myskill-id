import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError';

export const errorHandler: ErrorRequestHandler = function (
  err,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode || 'APP_ERROR',
    });
    return;
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    res.status(400).json({
      message: `Invalid ID format: ${err.value}`,
      errorCode: 'INVALID_OBJECT_ID',
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      message: 'Invalid access token. Please log in again.',
      errorCode: 'INVALID_TOKEN',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      message: 'Your session has expired. Please log in again.',
      errorCode: 'TOKEN_EXPIRED',
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    message: 'Something went wrong. Please try again later.',
    errorCode: 'INTERNAL_SERVER_ERROR',
  });
};
