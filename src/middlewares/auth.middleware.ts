import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = 'your_jwt_secret';

interface JwtPayload {
  id: string;
  username: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Forbidden' });
  }
};
