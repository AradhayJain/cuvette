import React, { useEffect, useState } from "react";
import axios from "axios";
// import Applied from "../hooks/Applied";

const ApplicantDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Applied");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  
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
  }, []);


  const handleWithdraw = async (applicationId) => {
    const id=applicationId
    console.log(applicationId)
    try {
      const {data}=await axios.delete(`/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh list
      fetchApplications();
    } catch (err) {
      console.error("Error withdrawing application", err);
    }
  };

  const filteredApplications = applications.filter((app) =>
    selectedTab === "Applied" ? app.status === "Applied" :
    selectedTab === "Interview" ? app.status === "Interview" :
    selectedTab === "Offer" ? app.status === "Offer" :
    selectedTab === "Rejected" ? app.status === "Rejected" : true
  );

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="sm:p-6  pt-32 p-6">
      <h2 className="text-3xl font-bold mb-6">My Applications</h2>

      <div className="flex gap-4 mb-6">
        {["Applied", "Interview", "Offer", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded ${selectedTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <p>No applications in {selectedTab}.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApplications.map((app) => (
            <div className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{app.job.role}</h3>
              <p className="text-gray-600">Company: {app.job.company}</p>
              <p>Status: <span className="font-bold">{app.status}</span></p>

              {app.status === "Applied" && (
                <button
                  // {console.log(app._id)}
                  onClick={() => handleWithdraw(app._id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Withdraw
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;
