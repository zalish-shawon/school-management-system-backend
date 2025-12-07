import { Schema, model } from "mongoose";

export interface ISection {
  name: string;
  classId: Schema.Types.ObjectId;
  classTeacher?: Schema.Types.ObjectId;
}

export interface IClass {
  name: string;        // e.g., Class 6
  level: number;       // 6
  classTeacher?: Schema.Types.ObjectId;
  sections: Schema.Types.ObjectId[];
  studentCount: number;
}

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true },
    classTeacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
    sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
    studentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ClassModel = model<IClass>("Class", classSchema);