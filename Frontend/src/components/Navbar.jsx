import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";


const Navbar = () => {
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔠 Get first letter of username
  const profileimg = () => {
    return user?.username?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <nav className="w-full bg-white px-6 py-4 flex justify-between items-center shadow-xl fixed top-0 z-50">
      {/* 🔗 Logo */}
      <Link
        to="/"
        className="text-2xl font-black tracking-tight text-[#ff2969]"
      >
        Myminilink 🔗
      </Link>

      {/* 🧭 Nav Right */}
      <div className="flex gap-6 items-center text-sm font-medium relative ">
        {isAuth ? (
          <>
            <Link to="/dashboard" className="hover:text-[#ff2969]">
              Dashboard
            </Link>

            {/* 🧑 Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
             
                  <div className="w-8 h-8 bg-[#ff2969] text-white rounded-full flex items-center justify-center font-bold">
                    {profileimg()}
                  </div>
              
               
              </button>

              {/* 🧾 Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fadeIn overflow-hidden">
               
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            to="/register"
            className="bg-[#ff2969] hover:bg-pink-600 px-4 py-2 rounded-xl text-white transition"
          >
            Sign up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
