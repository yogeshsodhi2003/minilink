import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    console.log("Logging in:", formData);
    try {
      const res = await axios.post(
        "http://localhost:3000/user/login",
        formData,
      );
      const token = res.data.token;
      localStorage.setItem("token", token);

      navigate("/");
      console.log(res.data);
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl shadow-md w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-[#ff2969] text-center">
          Welcome Back 👋
        </h2>

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
          Login
        </button>

        <p className="mt-4 text-sm text-white/40 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-[#ff2969] hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
