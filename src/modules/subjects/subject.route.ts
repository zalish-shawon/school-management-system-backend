import express from "express";
import { protect, authorize } from "../../middlewares/auth";
import {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  assignTeacher,
  deleteSubject,
} from "./subject.controller";

const router = express.Router();
router.use(protect);

router.post("/addSubject", authorize("admin"), createSubject);
router.get("/allSubjects", authorize("admin", "staff"), getSubjects);
router.get("/:id", authorize("admin", "staff"), getSubject);
router.put("/:id", authorize("admin"), updateSubject);
router.put("/:id/assign-teacher", authorize("admin"), assignTeacher);
router.delete("/:id", authorize("admin"), deleteSubject);

export default router;