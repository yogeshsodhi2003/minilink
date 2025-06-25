import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="w-full    px-6 py-4 flex justify-between items-center shadow-xl fixed top-0 z-50">
      {/* Left: Logo */}
      <Link
        to="/"
        className="text-2xl font-black tracking-tight text-[#ff2969]"
      >
        Myminilink 🔗
      </Link>

      {/* Right: Nav Links */}
      <div className="flex gap-6 items-center  text-sm font-medium">
        {isAuth ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-[#ff2969] hover:bg-pink-600 px-4 py-2 rounded-xl text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="login bg-[#ff2969] hover:bg-pink-600 px-4 py-2 rounded-xl text-white transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
