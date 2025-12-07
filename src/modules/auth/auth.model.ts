import mongoose, { Document, Schema } from 'mongoose';

export type IRefresh = Document & {
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
};

const refreshSchema = new Schema<IRefresh>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

const RefreshToken = mongoose.model<IRefresh>('RefreshToken', refreshSchema);
export default RefreshToken;