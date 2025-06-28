import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { QRCodeCanvas } from "qrcode.react";
import { CircleX } from "lucide-react";
import Loading from "../components/Loading";
import Feature from "../components/feature";
import CTASection from "../components/Cta";
import Footer from "../components/Footer.jsx";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { Copy } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);
  const [copiedId, setCopiedId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return toast.error("Please enter a URL");
    setIsLoading(true);
    const originalUrl = url;
    const userId = user?.userId;

    try {
      const res = await axios.post(`${backendUrl}/shorten`, {
        originalUrl,
        customSlug: customSlug.trim(),
        userId,
      });
      setShortUrl(res.data.shortUrl);
      toast.success("URL shortened successfully!");
    } catch (err) {
      toast.error("Something went wrong.");
      console.log(err);
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

  const handleqr = () => {
    setShowQR((prev) => !prev);
  };

  const handleShareQR = async () => {
    const canvas = document.getElementById("qrCanvas");
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (
        !navigator.canShare ||
        !navigator.canShare({ files: [new File([], "")] })
      ) {
        toast.error("Sharing is not supported on this browser.");
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
        toast.error("Error sharing QR code.");
        console.error("Error sharing:", err);
      }
    });
  };

  return (
    <main className="main min-h-screen relative">
      {isLoading && <Loading />}
      <Navbar />
      <ToastContainer />
      <div className="relative">
        {/* 🔥 Background image with dark overlay */}
        <div className="bg-[url('/bgimg.png')] bg-cover bg-center bg-no-repeat min-h-screen w-full absolute top-0 left-0 z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-black  opacity-70 z-0" />
        <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-24 px-4 text-center text-white">
          <h1 className="text-4xl sm:text-6xl font-black mb-4 text-[#ff2969]">
            Myminilink 🔗
          </h1>
          <p className="text-lg max-w-xl mb-8">
            Paste a long URL and we’ll shrink it down for easy sharing. No
            fluff. No ads. Just clean links.
          </p>

          {/* 🌀 Animated Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-md bg-white/10 p-6 md:p-10 rounded-3xl w-full max-w-lg shadow-2xl"
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 justify-center items-center"
            >
              <input
                type="url"
                placeholder="https://really-long-link.com/stuff"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/90 text-black outline-none placeholder:text-black/50"
              />
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="Custom slug (e.g. ashu-link)"
                className="w-full p-3 rounded-xl bg-white/90 text-black outline-none placeholder:text-black/50"
              />
              <button
                type="submit"
                className="bg-[#ff2969] w-full py-3 text-white rounded-xl font-bold hover:bg-pink-600 transition"
              >
                Shorten
              </button>
            </form>

            {/* ✅ Result */}
            {shortUrl && (
              <>
                <div className="mt-4 text-left w-full bg-white/90 p-4 rounded-xl">
                  <p className="text-black text-sm mb-2">
                    Your short URL will expire in 30 days
                  </p>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#ff2969] font-mono text-sm underline break-all"
                  >
                    {shortUrl}
                  </a>
                  <button
                    onClick={() =>
                      handleCopy(shortUrl)
                    }
                    className={`px-2 py-1 rounded-lg text-sm transition-all ml-3 ${
                      copiedId === url._id
                        ? "bg-green-500 text-white"
                        : "bg-pink-600 text-white hover:bg-pink-700"
                    }`}
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <button
                  onClick={handleqr}
                  className="mt-3 bg-[#ff2969] text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition"
                >
                  Create QR code
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* 📸 QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            key="qrModal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-2xl shadow-2xl text-center relative">
              <button
                onClick={handleqr}
                className="absolute top-3 right-3 text-black"
              >
                <CircleX />
              </button>
              <QRCodeCanvas
                id="qrCanvas"
                value={shortUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
              <button
                onClick={handleShareQR}
                className="mt-4 bg-[#ff2969] text-white px-6 py-2 rounded-xl font-bold hover:bg-pink-600 transition"
              >
                Share QR Code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Feature />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Home;
