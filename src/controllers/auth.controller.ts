import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = 'your_jwt_secret'; // ⚠️ TODO: use process.env.SECRET in real apps

// Define return type (optional)
interface LoginResponse {
  token: string;
}

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  const isValidPassword = user && await bcrypt.compare(password, user.password);
  if (!user || !isValidPassword) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
};


export const logout = (_req: Request, res: Response): void => {
  res.json({ message: 'Logged out (client must clear token)' });
};
