import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-zinc-800 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-[#ff2969] mb-2">MiniLink</h2>
          <p className="text-sm text-zinc-600">
            Shorten links like a pro. Fast, clean, and always free.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[#ff2969]">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-[#ff2969]">Dashboard</Link></li>
            <li><Link to="/login" className="hover:text-[#ff2969]">Login</Link></li>
            <li><Link to="/register" className="hover:text-[#ff2969]">Register</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Subscribe</h3>
          <p className="text-sm text-zinc-600 mb-3">Get updates about new features.</p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-md bg-zinc-100 outline-none focus:ring-2 ring-[#ff2969]"
            />
            <button
              type="submit"
              className="bg-[#ff2969] text-white px-3 py-2 rounded-md hover:bg-pink-600 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect</h3>
          <div className="flex gap-4 text-2xl text-[#ff2969]">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-zinc-500 mt-10 border-t pt-6">
        © {new Date().getFullYear()} MiniLink — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
