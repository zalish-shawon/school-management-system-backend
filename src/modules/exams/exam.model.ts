import mongoose, { Schema, Document } from "mongoose";

export interface IExam extends Document {
  name: string;
  classId: Schema.Types.ObjectId;
  sectionId?: Schema.Types.ObjectId;
  date: Date;
  totalMarks: number;
}

const examSchema = new Schema<IExam>(
  {
    name: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    date: { type: Date, required: true },
    totalMarks: { type: Number, required: true },
  },
  { timestamps: true }
);

const Exam = mongoose.model<IExam>("Exam", examSchema);
export default Exam;
