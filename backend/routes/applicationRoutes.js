import express from "express";
import { applyToJob, getMyApplications, updateApplicationStatus, deleteApplication, getAllApplications } from "../controllers/application.controller.js";
import protect  from "../middlewares/authMiddleware.js";

const router = express.Router();

// Applicant applies to a job
router.post("/:jobId", protect, applyToJob);

// Applicant views their applications
router.get("/find-all",getAllApplications)

router.get("/getAll", protect, getMyApplications);

// Applicant updates their application status
router.put("/:applicationId", protect, updateApplicationStatus);

// Applicant deletes an application
router.delete("/:applicationId", protect, deleteApplication);


export default router;
