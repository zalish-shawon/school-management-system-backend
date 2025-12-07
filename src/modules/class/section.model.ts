import { Schema, model } from "mongoose";

export interface ISection {
  name: string;
  classId: Schema.Types.ObjectId;
  classTeacher?: Schema.Types.ObjectId;
}

const sectionSchema = new Schema<ISection>(
  {
    name: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    classTeacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

export const Section = model<ISection>("Section", sectionSchema);