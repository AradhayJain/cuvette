import express from "express";
import { createJob, getAllJobs, getJobById, deleteJob, getJobByRecruiter } from "../controllers/job.controller.js";
import protect  from "../middlewares/authMiddleware.js";

const router = express.Router();

// Recruiter creates a new job
router.post("/create", protect, createJob);

// Get all available jobs (open to all users)
router.get("/getAll", getAllJobs);

// Get single job details
router.get("/:id", getJobById);

router.get("/getAll/:id", getJobByRecruiter);

// Recruiter deletes a job
router.delete("/:id", protect, deleteJob);

export default router;
