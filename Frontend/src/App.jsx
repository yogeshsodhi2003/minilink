import React, { useState } from "react";
import Home from "./pages/home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/userSlice";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // new state
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const base64Url = token.split(".")[1]; // get payload
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const user = JSON.parse(jsonPayload);
      dispatch(setCredentials({ user, token }));
    }
    setLoading(false); // hydration done
  }, []);
  if (loading) return <p>Loading...</p>; // wait till store is ready
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
