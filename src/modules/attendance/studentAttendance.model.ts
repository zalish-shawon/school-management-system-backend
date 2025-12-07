import mongoose, { Schema, Types, InferSchemaType } from 'mongoose';

const studentAttendanceSchema = new Schema(
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

// ⬅ Generate TypeScript type automatically from schema
export type IStudentAttendance = InferSchemaType<typeof studentAttendanceSchema> & {
  _id: Types.ObjectId;
};

const StudentAttendance = mongoose.model<IStudentAttendance>(
  'StudentAttendance',
  studentAttendanceSchema
);

export default StudentAttendance;
