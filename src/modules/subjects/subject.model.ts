import { Schema, model } from "mongoose";

export interface ISubject {
  name: string;
  code: string;
  classLevel: number;
  assignedTeacher?: Schema.Types.ObjectId;
  isDeleted: boolean;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    classLevel: { type: Number, required: true },
    assignedTeacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Subject = model<ISubject>("Subject", subjectSchema);