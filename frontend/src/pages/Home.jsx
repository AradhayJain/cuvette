import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});
  const navigate = useNavigate();
  const [applications,setApplications]=useState([]);
  const userInfo = localStorage.getItem("userInfo");
  const token = localStorage.getItem("token");
  useEffect(() => {

    if (!userInfo) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userInfo);

    if (user.role === "Recruiter") {
      navigate("/rec-dashboard"); 
      return;
    }

    
  }, [navigate]);
  const fetchJobs = async () => {
    try {
      const config={
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        }
      }
      const { data } = await axios.get("/api/jobs/getAll"); 

      
      console.log(jobs)
    
      setJobs(data.jobs); 
      
    } catch (error) {
      console.error(error);
      alert("Failed to fetch jobs");
    }
  };
  useEffect(() => {
    if(!token){
      navigate("/login")
    }
    fetchJobs();
  }, []);
  
  
  const handleApply = async (jobId) => {
    try {
      
      const {data}=await axios.post(`/api/applications/${jobId}`,{}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      alert("Application submitted successfully!");
      const application=data.application;
      console.log(application.job)

      fetchJobs();
      setAppliedJobs((prevAppliedJobs) => ({...prevAppliedJobs, [application.job]: true}));
      
      
      
      
      
    } catch (error) {
      console.error(error);
      alert("Application failed");
    }
  };
  const fetchApplications = async () => {
    try {
      const {data} = await axios.get("/api/applications/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(data.applications);
      console.log(applications)
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };
  
  

  


  useEffect(() => {
    fetchApplications();
    console.log(applications)
    const appliedJobsMap = {};
    applications.forEach((application) => {
      appliedJobsMap[application.job._id] = true;
    });
    setAppliedJobs(appliedJobsMap);
    
    console.log(appliedJobsMap)
  }, []); // Dependency should be [jobs], not [appliedJobs]
  


  

  return (
    <div className="sm:p-8 pt-24">
      <h1 className="text-3xl font-bold text-center mb-6">Available Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-center">No jobs available</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job._id} className="border p-6 rounded shadow-md">
              <h2 className="text-xl font-semibold mb-2">{job.role}</h2>
              <p className="text-gray-600 mb-2">Company: {job.company}</p>
              <p className="text-gray-600 mb-4">Location: {job.location || "Remote"}</p>
              <button
                onClick={() => handleApply(job._id)}
                disabled={appliedJobs[job._id]}
                className={`w-full p-2 rounded ${
                  appliedJobs[job._id] ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {appliedJobs[job._id] ? "Applied" : "Apply"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
