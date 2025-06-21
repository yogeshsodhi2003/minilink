import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch URLs for logged-in user
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user-urls", {
          withCredentials: true,
        });
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
      await axios.delete(`http://localhost:5000/api/url/${id}`, {
        withCredentials: true,
      });
      setUrls((prev) => prev.filter((url) => url._id !== id));
    } catch (err) {
      console.error("Error deleting URL:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 py-24">
      <h1 className="text-4xl font-bold text-[#ff2969] mb-6">Your MiniLinks</h1>

      {loading ? (
        <p className="text-white/60">Loading your links...</p>
      ) : urls.length === 0 ? (
        <p className="text-white/60">You haven’t shortened any links yet.</p>
      ) : (
        <div className="space-y-4">
          {urls.map((url) => (
            <div
              key={url._id}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center"
            >
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
                  href={`http://localhost:5000/${url.shortId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#ff2969] font-mono hover:underline break-all"
                >
                  http://localhost:5000/{url.shortId}
                </a>
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
  );
};

export default Dashboard;
