import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt'; 


const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const access_token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(access_token, SECRET) as JwtPayload;
      (req as any).user = decoded;
    } catch {
      
    }
  }

  next();
};
