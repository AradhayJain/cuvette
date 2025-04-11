import React, { useEffect, useState } from "react";
import axios from "axios";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const id=user?._id




  const fetchJobs = async () => {
    try {
      const {data} = await axios.get(`/api/jobs/getAll/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(data.jobs);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    
  }, []);

  const fetchApplicants = async (jobId) => {
    console.log("Fetching applicants for job ID:", jobId);
    console.log(jobs)
    try {
      // Fetch all applications
      const { data } = await axios.get("/api/applications/find-all", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Filter applications where jobId matches
      const matchedApplicants = data.applications.filter(
        (application) => application.job._id.toString() === jobId
      );
  
     
      setApplicants(matchedApplicants);
  
      setSelectedJob(jobId);
  
      
    } catch (err) {
      console.error("Error fetching applicants", err);
    }
  };

  useEffect(() => {
    console.log("Matched Applicants:", applicants);
  }, []);
  

  
  

  const updateStatus = async (applicationId, newStatus) => {
    
    try {
      const {data} =await axios.put(`/api/applications/${applicationId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplicants(selectedJob);
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">My Posted Jobs</h2>

      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {jobs.map((job) => (
            <div className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{job.role}</h3>
              <p className="text-gray-600">{job.company}</p>

              <button
                onClick={() => fetchApplicants(job._id)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Applicants
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Applicants Section */}
      {selectedJob && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Applicants</h3>
          {applicants.length === 0 ? (
            <p>No applicants for this job.</p>
          ) : (
            <div className="space-y-4">
              {applicants.map((applicant) => (
                <div key={applicant.applicant._id} className="border p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{applicant.applicant.name}</p>
                    <p>Status: <span className="font-bold">{applicant.status}</span></p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(applicant._id, "Interview")}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Interview
                    </button>
                    <button
                      onClick={() => updateStatus(applicant._id, "Offer")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Offer
                    </button>
                    <button
                      onClick={() => updateStatus(applicant._id, "Rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
