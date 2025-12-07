import { Schema, model } from "mongoose";

export interface ITeacher {
  fullName: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
  dateOfBirth: Date;

  designation: string; // e.g., Senior Teacher, Assistant Teacher
  joiningDate: Date;
  salary: number;

  assignedClasses: Schema.Types.ObjectId[]; // Class references
  assignedSubjects: string[];

  address?: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: { type: Date, required: true },

    designation: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    salary: { type: Number, required: true },

    assignedClasses: [{ type: Schema.Types.ObjectId, ref: "Class" }],
    assignedSubjects: [{ type: String }],

    address: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

export const Teacher = model<ITeacher>("Teacher", teacherSchema);