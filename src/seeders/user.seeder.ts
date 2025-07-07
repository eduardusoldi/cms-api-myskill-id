import { connectDB } from '../config/db';
import { User } from '../models/user.model';

(async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists, skipping seeding.');
      process.exit(0);
    }

    const admin = new User({
      name: 'Admin User',
      username: 'admin',
      password: 'admin123',
    });

    await admin.save();
    console.log('Seeded admin user: admin / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
})();
