import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type IUser = Document & {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
  comparePassword: (candidate: string) => Promise<boolean>;
};

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'teacher', 'student', 'parent', 'staff'], default: 'student' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  // @ts-ignore
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;