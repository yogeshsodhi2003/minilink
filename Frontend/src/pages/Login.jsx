import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/userSlice";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Loading from "../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/user/login`, formData);
      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.token,
        })
      );
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Something went wrong. Try again!";
      toast.error(`🚫 ${errorMsg}`);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Google user:", decoded);

    // Send to your backend to register/login
    try {
      const res = await axios.post(`${backendUrl}/user/auth/google`, {
        name: decoded.name,
        email: decoded.email,
        sub: decoded.sub,
        picture: decoded.picture,
      });

      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.token,
        })
      );

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Google auth failed", err);
    }
  };

  return (
    <>
      <Navbar />
      {isLoading && <Loading />}
      <div className="min-h-screen  flex items-center justify-center px-4 relative overflow-hidden">
        {/* glowing blurred circles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white opacity-10 blur-2xl rounded-full z-0"></div>

        <motion.form
          onSubmit={handleSubmit}
          className="relative z-10 bg-gradient-to-br from-[#ff2969] via-pink-500 to-[#ff2969] backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-white">
            Welcome Back
          </h2>

          <div className="mb-4">
            <label className="block mb-1 text-sm text-white/70">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white outline-none"
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
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-[#ff2969] font-semibold py-3 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
          <p className="my-4 text-center text-white/50">or</p>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google Login Failed")}
          />

          <p className="mt-6 text-sm text-white/60 text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-white underline hover:text-[#ff2969]"
            >
              Register Now
            </Link>
          </p>
        </motion.form>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
};

export default Login;
