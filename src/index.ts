import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes';
import { connectDB } from './config/db';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/users', userRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
