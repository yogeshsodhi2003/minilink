import React from "react";
import Home from "./pages/home";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Navbar />
      <Home />
    </div>
  );
};

export default App;
