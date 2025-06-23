import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const [copiedId, setCopiedId] = useState(false);

  //Fetch URLs for logged-in user
  useEffect(() => {
    const fetchUrls = async () => {
      const userId = user.userId;
      try {
        const res = await axios.get(
          `http://localhost:3000/url/allurls/${userId}`
        );
        setUrls(res.data);
      } catch (err) {
        console.error("Error fetching URLs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/url/${id}`, {});
      setUrls((prev) => prev.filter((url) => url._id !== id));
    } catch (err) {
      console.error("Error deleting URL:", err);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getRemainingDays = (createdAt) => {
    const created = new Date(createdAt);
    const expiry = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
    const now = new Date();

    const diffInMs = expiry - now;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays >= 0 ? diffInDays : 0;
  };

  const filteredUrls = urls
    .filter(
      (url) =>
        url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.shortId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOption === "mostClicked") {
        return b.clickCount - a.clickCount;
      } else if (sortOption === "leastClicked") {
        return a.clickCount - b.clickCount;
      }
      return 0;
    });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0d0d0d] text-white px-6 py-24">
        <input
          type="text"
          placeholder="Search links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2 rounded mb-4 ml-2"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="mostClicked">Most Clicked</option>
          <option value="leastClicked">Least Clicked</option>
        </select>

        <h1 className="text-4xl font-bold text-[#ff2969] mb-6">
          Your MiniLinks
        </h1>

        {loading ? (
          <p className="text-white/60">Loading your links...</p>
        ) : urls.length === 0 ? (
          <p className="text-white/60">You haven’t shortened any links yet.</p>
        ) : (
          <div className="space-y-4">
            {filteredUrls.map((url) => (
              <div
                key={url._id}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center"
              >
                {/* 🔥 Expiry countdown */}
                <p className="text-sm text-gray-600">
                  Expires in: <strong>{getRemainingDays(url.createdAt)}</strong>{" "}
                  days
                </p>
                <div>
                  <p className="text-sm text-white/60">Original:</p>
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-white hover:underline break-all"
                  >
                    {url.originalUrl}
                  </a>

                  <p className="text-sm text-white/60 mt-2">Short:</p>
                  <a
                    href={`http://localhost:3000/url/${url.shortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#ff2969] font-mono hover:underline break-all"
                  >
                    http://localhost:3000/url/{url.shortId}
                  </a>
                  <button
                    onClick={() =>
                      handleCopy(`http://localhost:3000/url/${url.shortId}`)
                    }
                    className="bg-black text-white px-2 py-1 rounded mt-2 hover:bg-gray-800"
                  >
                    {copiedId ? "Copied!" : "Copy"}
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(url._id)}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
