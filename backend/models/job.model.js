import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },

  role: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  salary: {
    type: Number,
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Recruiter who posted the job
    required: true,
  },

  applicants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Applicant user reference
      },
      status: {
        type: String,
        enum: ["Applied", "Interview", "Offer", "Rejected"],
        default: "Applied",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
// This code defines a Mongoose schema and model for a Job entity in a Node.js application.