import { Schema, model } from "mongoose";

export interface ITimetable {
  classId: Schema.Types.ObjectId;
  sectionId: Schema.Types.ObjectId;
  day: string; // Saturday–Friday

  period: number; // 1,2,3,4...
  subjectId: Schema.Types.ObjectId;
  teacherId: Schema.Types.ObjectId;
  room?: string;

  isDeleted: boolean;
}

const timetableSchema = new Schema<ITimetable>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },

    day: {
      type: String,
      enum: [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ],
      required: true,
    },

    period: { type: Number, required: true },

    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    room: { type: String },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Timetable = model<ITimetable>("Timetable", timetableSchema);