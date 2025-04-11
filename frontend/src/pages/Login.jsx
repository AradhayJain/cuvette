import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data}=await axios.post("/api/users/login", formData);

      alert("Login successful!");
      localStorage.setItem("token", data.token); 
      localStorage.setItem("userInfo", JSON.stringify(data.user)); 
      navigate("/");
    //   navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6 shadow-md rounded">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        
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

        <button type="submit" className="bg-green-500 text-white p-2 w-full rounded hover:bg-green-600">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
