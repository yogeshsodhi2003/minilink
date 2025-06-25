import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { QRCodeCanvas } from "qrcode.react";

import axios from "axios";

const Home = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [showQR, setShowQR] = useState(false);

  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    const originalUrl = url;
    const userId = user?.userId;
    try {
      const res = await axios.post(`${backendUrl}/shorten`, {
        originalUrl,
        customSlug: customSlug.trim(), // send custom slug
        userId,
      });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      console.log(err);
    }
  };
  const handleqr = () => {
    setShowQR(true);
  };

  //handle qr code share button
  const handleShareQR = async () => {
    const canvas = document.getElementById("qrCanvas");
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (
        !navigator.canShare ||
        !navigator.canShare({ files: [new File([], "")] })
      ) {
        alert("Sharing is not supported on this browser.");
        return;
      }

      const file = new File([blob], "minilink-qr.png", { type: "image/png" });

      try {
        await navigator.share({
          title: "MiniLink QR Code",
          text: "Here’s your QR Code from MiniLink!",
          files: [file],
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen   flex flex-col items-center pt-25 px-4">
        <h1 className="text-4xl sm:text-6xl font-black mb-4 text-[#ff2969] tracking-tight text-center">
          Myminilink 🔗
        </h1>
        <p className="text-center text-70 max-w-md mb-8">
          Paste a long URL and we’ll shrink it down for easy sharing. No fluff.
          No ads. Just clean links.
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
            className="flex-1 p-3 rounded-4xl border-4 border-black-600 placeholder:80 outline-none"
          />
          <input
            type="text"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            placeholder="Custom slug (e.g. ashu-link)"
            className="flex-1 p-3 rounded-4xl border-4 border-black-600   placeholder:50 outline-none"
          />
          <button
            type="submit"
            className="bg-[#ff2969]  text-white  px-6 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition"
          >
            Shorten
          </button>
        </form>

        {shortUrl && (
          <>
            <div className="m-8 border-3  border-black-600 shadow-xl  px-6 py-4 rounded-xl">
              <p className="80 text-sm mb-2">
                Your short URL will expire in 30 days
              </p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#ff2969] font-mono text-lg underline break-all"
              >
                {shortUrl}
              </a>
            </div>
            <button
              onClick={handleqr}
              className="bg-[#ff2969]  text-white  px-6 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition"
            >
              Create QR code
            </button>
          </>
        )}
        {/* ✅ QR CODE */}
        {showQR && (
          <div className="m-3 text-center">
            <QRCodeCanvas
              id="qrCanvas"
              value={shortUrl}
              size={160}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />

            <button
              onClick={handleShareQR}
              className="bg-[#ff2969] mt-3  text-white  px-6 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition"
            >
              Share QR Code
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
