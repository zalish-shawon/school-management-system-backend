import mongoose, { Schema } from 'mongoose';

export interface INotification {
  title: string;
  message: string;
  userIds: mongoose.Types.ObjectId[]; // targeted users
  readBy: mongoose.Types.ObjectId[];
  type: 'info' | 'warning' | 'alert';
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    type: { type: String, enum: ['info','warning','alert'], default: 'info' },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
