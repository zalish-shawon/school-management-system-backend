import express from "express";
import { protect, authorize } from "../../middlewares/auth";
import {
  createTimetable,
  getClassRoutine,
  getTeacherRoutine,
  updateTimetable,
  deleteTimetable,
} from "./timetable.controller";

const router = express.Router();
router.use(protect);

router.post("/addTimeTable", authorize("admin", "staff"), createTimetable);
router.get("/class/:classId/:sectionId", authorize("admin", "staff", "student"), getClassRoutine);
router.get("/teacherRoutine/:teacherId", authorize("admin", "staff", "teacher"), getTeacherRoutine);
router.put("/:id", authorize("admin", "staff"), updateTimetable);
router.delete("/:id", authorize("admin"), deleteTimetable);

export default router;