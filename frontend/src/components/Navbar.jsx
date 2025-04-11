import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // for animation
import axios from "axios"; // for API calls

function Navbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo")); // assuming userInfo has role like 'recruiter' or 'applicant'

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setShowDropdown(false);
    if(!localStorage.getItem("userInfo")){
      navigate("/login");
    }
    window.location.reload(); // reload the page to reflect the changes
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleProfileClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleAddJobClick = () => {
    setShowDropdown(false);
    setShowAddJobModal(true);
  };

  const handleModalClose = () => {
    setShowAddJobModal(false);
  };

  const handleAddJobSubmit =async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jobDetails = {
      role: formData.get("role"),
      company: formData.get("company"),
      location: formData.get("location"),
      description: formData.get("description"),
      salary: formData.get("salary"),
    };
    console.log("Job Details Submitted:", jobDetails);
    try {
      const {data}=await axios.post("/api/jobs/create", jobDetails, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      alert("Job added successfully!");
      
    } catch (error) {
      console.error(error);
      alert("Failed to add job");
      
    }
    

      
    
    // You can now send jobDetails to backend API
    setShowAddJobModal(false);
  };

  return (
    <>
      <nav className="bg-blue-400 text-white p-4 flex justify-between items-center shadow-md fixed w-full z-10">
        <div className="text-2xl font-bold">
          <Link to="/">Student Job Tracker</Link>
        </div>

        {token ? (
          <div className="flex gap-6 items-center text-lg relative">
            {userInfo.role=="Applicant" ? <Link to="/">Home</Link> :<></>}
            {userInfo.role=="Applicant" ? <Link to="/app-dashboard">Dashboard</Link>:<Link to="/rec-dashboard">Dashboard</Link>}

            <button
              onClick={handleProfileClick}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition relative"
            >
              menu
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 right-0 bg-white text-green-600 shadow-lg rounded-lg p-4 flex flex-col gap-2 min-w-[150px] z-20"
                >
                  {userInfo?.role === "Recruiter" && (
                    <button
                      onClick={handleAddJobClick}
                      className="hover:bg-gray-100 p-2 rounded text-left"
                    >
                      Add Job
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="hover:bg-gray-100 p-2 rounded text-left text-red-500"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex gap-6 items-center text-lg">
            <button
              onClick={handleLogin}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Register
            </button>
          </div>
        )}
      </nav>

      {/* Add Job Modal */}
      <AnimatePresence>
        {showAddJobModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Add Job</h2>
              <form onSubmit={handleAddJobSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="description"
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  name="salary"
                  placeholder="salary"
                  className="border p-2 rounded"
                />
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
