import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/userSlice";
import Navbar from "../components/Navbar";

const Register = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${backendUrl}/user/register`, formData);

      // after successful register
      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.token,
        })
      );
      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center  px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 p-8 rounded-2xl shadow-md w-full max-w-md text-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-[#ff2969] text-center">
            Create Account
          </h2>

          <div className="mb-4">
            <label className="block mb-1 text-sm text-white/70">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm text-white/70">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm text-white/70">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff2969] hover:bg-pink-600 text-white font-medium py-3 rounded-xl transition"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
