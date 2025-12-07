import express from "express";
import { protect, authorize } from "../../middlewares/auth";
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  promoteStudent,
} from "./student.controller";

const router = express.Router();

router.use(protect);
router.use(authorize("admin", "staff"));

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/:id", getStudent);
router.patch("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.patch("/promote/:id", promoteStudent);

export default router;