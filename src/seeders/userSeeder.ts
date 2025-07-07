import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { connectDB } from '../config/db';

const seedUsers = async () => {
  await connectDB();

  const existing = await User.findOne({ username: 'admin' });
  if (existing) {
    console.log('⚠️ Admin user already exists. Skipping...');
    return mongoose.disconnect();
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = new User({
    name: 'Admin User',
    username: 'admin',
    password: hashedPassword,
  });

  await user.save();
  console.log('✅ Seeded admin user: admin / admin123');

  mongoose.disconnect();
};

seedUsers().catch((err) => {
  console.error('❌ Seeder failed:', err);
  mongoose.disconnect();
});
