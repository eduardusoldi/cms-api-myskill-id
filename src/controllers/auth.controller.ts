import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    console.log('Login attempt:', { username });
    console.log('DB Password Hash:', user.password);

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password match?', isValidPassword);

    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.json({ message: 'Logged out (client must clear token)' });
};
