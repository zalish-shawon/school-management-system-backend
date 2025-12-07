import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAttendance extends Document {
  student: Schema.Types.ObjectId;
  classId: Schema.Types.ObjectId;
  sectionId: Schema.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late';
  remark?: string;
}

const studentAttendanceSchema = new Schema<IStudentAttendance>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    remark: { type: String },
  },
  { timestamps: true }
);

const StudentAttendance = mongoose.model<IStudentAttendance>('StudentAttendance', studentAttendanceSchema);
export default StudentAttendance;