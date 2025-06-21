import React, { useState } from "react";

import axios from "axios";

const Home = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");



  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!url) return;
    const originalUrl = url
    try{
      const res = await axios.post("http://localhost:3000/url/shorten", {originalUrl} )
      setShortUrl(res.data.shortUrl);
      console.log("short url created" , res.data) 
    }catch (err){
        console.log(err)
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl sm:text-6xl font-black mb-4 text-[#ff2969] tracking-tight text-center">
        SnapMy.Link 🔗
      </h1>
      <p className="text-center text-white/70 max-w-md mb-8">
        Paste a long URL and we’ll shrink it down for easy sharing.
        No fluff. No ads. Just clean links.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex flex-col sm:flex-row gap-4"
      >
        <input
          type="url"
          placeholder="https://really-long-link.com/stuff"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-3 rounded-2xl bg-zinc-900 text-white placeholder:text-white/50 outline-none"
        />
        <button
          type="submit"
          className="bg-[#ff2969] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition"
        >
          Shorten
        </button>
      </form>

      {shortUrl && (
        <div className="mt-8 bg-zinc-800 px-6 py-4 rounded-xl">
          <p className="text-white/80 text-sm mb-2">Your short URL:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#ff2969] font-mono text-lg underline break-all"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </main>
  );
};

export default Home;
