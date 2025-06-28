import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import {
  setLinks,
  deleteLink as removeLink,
  setLoading,
  setError,
} from "../redux/linkSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const user = useSelector((state) => state.user.user);
  const { data: urls, loading } = useSelector((state) => state.links);
  const [isLoading , setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      const userId = user.userId;
      dispatch(setLoading(true));
      try {
        const res = await axios.get(`${backendUrl}/allurls/${userId}`);
        dispatch(setLinks(res.data));
      } catch (err) {
        dispatch(setError("Failed to fetch links"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUrls();
  }, []);

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${backendUrl}/${id}`);
      dispatch(removeLink(id));
    } catch (err) {
      console.error("Delete failed", err);
    }
    setIsLoading(false);
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getRemainingDays = (createdAt) => {
    const created = new Date(createdAt);
    const expiry = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffInMs = expiry - now;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays >= 0 ? diffInDays : 0;
  };

  const filteredUrls = urls
    .filter((url) =>
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "mostClicked") return b.clickCount - a.clickCount;
      if (sortOption === "leastClicked") return a.clickCount - b.clickCount;
      return 0;
    });

  return (
    <>
      <Navbar />
      {isLoading && <Loading/>}
      <div className="min-h-screen px-6 py-24 bg-gradient-to-br from-[#fef2f2] via-[#ffe4e6] to-[#ffe8f0] text-zinc-800">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-pink-200 text-zinc-800 placeholder:text-zinc-500 outline-none"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-pink-200 text-zinc-800 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostClicked">Most Clicked</option>
            <option value="leastClicked">Least Clicked</option>
          </select>
        </div>

        <h1 className="text-4xl font-bold text-[#ff2969] mb-6 text-center">
          Your MiniLinks
        </h1>

        {loading ? (
          <p className="text-center">Loading your links...</p>
        ) : urls.length === 0 ? (
          <p className="text-center text-gray-500">No links found yet.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredUrls.map((url, index) => (
              <motion.div
                key={url._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-2xl bg-white/40 border border-white/20 p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all"
              >
                {/* Click Badge */}
                <div className="absolute top-4 right-4 bg-[#ff2969] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {url.clickCount} clicks
                </div>

                <p className="text-sm text-zinc-600 mb-2">
                  Expires in <strong>{getRemainingDays(url.createdAt)}</strong> days
                </p>

                <div className="mb-3">
                  <p className="text-zinc-500 text-sm font-medium">Original URL</p>
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-800 font-medium break-words hover:underline"
                  >
                    {url.originalUrl}
                  </a>
                </div>

                <div>
                  <p className="text-zinc-500 text-sm font-medium">Short Link</p>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={`${backendUrl}/${url.shortId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#ff2969] hover:underline break-all"
                    >
                      {backendUrl}/{url.shortId}
                    </a>
                    <button
                      onClick={() => handleCopy(`${backendUrl}/${url.shortId}`, url._id)}
                      className={`px-2 py-1 rounded-lg text-sm transition-all ${
                        copiedId === url._id
                          ? "bg-green-500 text-white"
                          : "bg-pink-600 text-white hover:bg-pink-700"
                      }`}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(url._id)}
                  className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-2xl font-semibold transition"
                >
                  Delete Link
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
