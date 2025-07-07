import { Router } from 'express';
import { User } from '../models/user.model';

const router = Router();

router.get('/', async (_req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post('/', async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.status(201).json(user);
});

export default router;
