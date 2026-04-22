import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/upload.js";
import {
  addStudent,
  getStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/add", authAdmin, upload.single("photo"), addStudent);
router.get("/list", authAdmin, getStudents);
router.get("/:id", authAdmin, getSingleStudent);
router.put("/update/:id", authAdmin, upload.single("photo"), updateStudent);
router.delete("/delete/:id", authAdmin, deleteStudent);

export default router;