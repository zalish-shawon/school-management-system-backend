import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';

export type IUser = Document & {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
  comparePassword: (candidate: string) => Promise<boolean>;
};

const userSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'teacher', 'student', 'parent', 'staff'], default: 'student' },
}, { timestamps: true });
userSchema.pre<IUser>('save', async function (this: IUser) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  // @ts-ignore
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;