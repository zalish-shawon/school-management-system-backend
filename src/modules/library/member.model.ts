import mongoose, { Schema } from 'mongoose';

export interface ILibraryMember {
  studentId?: mongoose.Types.ObjectId;
  teacherId?: mongoose.Types.ObjectId;
  name: string;
  memberType: 'student' | 'teacher';
}

const memberSchema = new Schema<ILibraryMember>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    name: { type: String, required: true },
    memberType: { type: String, enum: ['student','teacher'], required: true },
  },
  { timestamps: true }
);

const LibraryMember = mongoose.model('LibraryMember', memberSchema);
export default LibraryMember;
