import Job from "../models/job.model.js";


export const createJob = async (req, res) => {
  try {
    const { title, company, location, description,role } = req.body;

    const job = new Job({
      company,
      role,
      location,
      description,
      postedBy: req.user._id, 
    });

    await job.save();

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    console.log(jobs)
    res.status(200).json({
      jobs:jobs
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      job:job});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getJobByRecruiter = async (req, res) => {
  try {
    const userId=req.params.id
    const jobs = await Job.find({ postedBy: userId })
    if (!jobs) {
      return res.status(404).json({ message: "No jobs found" });
    }
    res.status(200).json({
      jobs: jobs,
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateJob = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

  
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.description = description || job.description;

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.remove();
    res.status(200).json({ message: "Job removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
