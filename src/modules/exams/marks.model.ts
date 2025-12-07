import mongoose, { Schema, Document } from 'mongoose';

export interface IMarks extends Document {
  examId: Schema.Types.ObjectId;
  studentId: Schema.Types.ObjectId;
  subjectId: Schema.Types.ObjectId;
  obtainedMarks: number;
}

const marksSchema = new Schema<IMarks>({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  obtainedMarks: { type: Number, required: true },
}, { timestamps: true });

const Marks = mongoose.model<IMarks>('Marks', marksSchema);
export default Marks;