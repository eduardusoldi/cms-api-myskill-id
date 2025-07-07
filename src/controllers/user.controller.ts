import { Request, Response } from 'express';
import { User } from '../models/user.model';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
};

export const createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, username, password } = req.body;
  const existing = await User.findOne({ username });

  if (existing) {
    res.status(400).json({ message: 'Username taken' });
    return;
  }

  const user = new User({ name, username, password });
  await user.save();

  res.status(201).json({ message: 'User created' });
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (userId !== req.params.id) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const { name, password } = req.body;
  const update: any = {};
  if (name) update.name = name;
  if (password) update.password = password;

  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });

  res.json({ message: 'User updated', user });
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (userId !== req.params.id) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
