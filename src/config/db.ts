import mongoose from 'mongoose';
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/myskill-id'

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
