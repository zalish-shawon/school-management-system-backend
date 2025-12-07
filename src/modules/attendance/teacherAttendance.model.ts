import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherAttendance extends Document {
  teacher: Schema.Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'leave';
}

const teacherAttendanceSchema = new Schema<ITeacherAttendance>(
  {
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { type: String, enum: ['present', 'absent', 'leave'], default: 'present' },
  },
  { timestamps: true }
);

const TeacherAttendance = mongoose.model<ITeacherAttendance>('TeacherAttendance', teacherAttendanceSchema);
export default TeacherAttendance;