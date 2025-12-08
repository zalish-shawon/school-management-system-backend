import mongoose, { Schema } from "mongoose";

export interface IMarks {
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  obtainedMarks: number;
}

const marksSchema = new Schema<IMarks>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    obtainedMarks: { type: Number, required: true },
  },
  { timestamps: true }
);


const Marks = mongoose.model("Marks", marksSchema);
export default Marks;
