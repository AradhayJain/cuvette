import Application from "../models/application.model.js";
import Job from "../models/job.model.js";


export const applyToJob = async (req, res) => {
  try {
    const  jobId  = req.params.jobId; 

    const existingApplication = await Application.findOne({
      applicant: req.user._id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    job.applicants.push({
      user: req.user._id,
      status: "Applied",
      appliedAt: Date.now(),
    });
    await job.save();

    const application = new Application({
      applicant: req.user._id,
      job: jobId,
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application:application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job")
      .sort({ dateOfApplication: -1 });

    res.status(200).json({
      applications:applications});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.applicationId;
    console.log(applicationId)
    console.log(req.params)

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    
    const jobId = application.job;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const applicant = job.applicants.find(
      (applicant) => applicant.user.toString() === application.applicant.toString()
    );
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    applicant.status = status || applicant.status;

    application.status = status || application.status;
    const updatedApplication = await application.save();
    await job.save();



    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const deleteApplication = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    console.log(applicationId)
    console.log(req.params)
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const jobId= application.job;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    job.applicants = job.applicants.filter(
      (applicant) => applicant.user.toString() !== req.user._id.toString()
    );
    await job.save();

    await application.deleteOne();
    res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('job').populate('applicant');
    res.status(200).json({
      applications:applications});
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
