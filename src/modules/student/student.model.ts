import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  gender: "male" | "female" | "other";
  dob: Date;
  admissionId: string;
  classId: mongoose.Schema.Types.ObjectId;
  sectionId: mongoose.Schema.Types.ObjectId;
  parentName: string;
  parentPhone: string;
  address: string;
  photo?: string;
  isActive: boolean;
  isDeleted: boolean;
}

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob: { type: Date, required: true },

    admissionId: { type: String, required: true, unique: true },
    // classId: { type: Schema.Types.ObjectId, ref: "Class" },
    classId: { type: Schema.Types.ObjectId, ref: "Class" },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    // sectionId: { type: Schema.Types.ObjectId, ref: "Section" },

    parentName: { type: String, required: true },
    parentPhone: { type: String },
    address: { type: String, required: true },
    photo: { type: String },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>("Student", studentSchema);