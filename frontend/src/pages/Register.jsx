import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";


import axios from "axios";

function Register() {
  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/");
      }
    }, []);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Applicant",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data}=await axios.post("/api/users/register", formData);
      alert("Registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6 shadow-md rounded">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 w-full"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <select
          name="role"
          className="border p-2 w-full"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="Applicant">Applicant</option>
          <option value="Recruiter">Recruiter</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
