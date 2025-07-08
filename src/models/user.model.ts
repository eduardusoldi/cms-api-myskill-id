import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = model<IUser>('User', userSchema);
