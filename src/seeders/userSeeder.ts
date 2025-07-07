import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/user.model';

(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');

    // Optional: Clean up existing user
    await User.deleteMany({ username: 'admin' });

    // Use plain password — let pre('save') hash it
    const admin = new User({
      name: 'Admin User',
      username: 'admin',
      password: 'admin123', // plain text — will be hashed by pre('save')
    });

    await admin.save();
    console.log('✅ Seeded admin user: admin / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
})();
