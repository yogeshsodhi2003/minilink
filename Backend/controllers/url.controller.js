import url from "../models/url.model.js";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import User from "../models/user.model.js";
// Create a new URL

export const createUrl = async (req, res) => {
  const { originalUrl, userId } = req.body;
  // if (!isValidUrl(originalUrl)) {
  //     return res.status(400).json({ message: "Invalid URL format" });
  // }
  try {
    const shortId = nanoid(6); // Generate a unique short ID
    const newUrl = new url({
      originalUrl,
      shortId,
      user: userId ? new mongoose.Types.ObjectId(userId) : null, // Optional user association
    });
    res.status(201).json({ shortUrl: `http://localhost:3000/url/${shortId}` });
    await newUrl.save();
  } catch (error) {
    console.error("Error creating URL:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get URL by short ID
export const getUrlByShortId = async (req, res) => {
  const { shortId } = req.params;
  try {
    const urlData = await url.findOne({ shortId });
    if (!urlData) {
      return res.status(404).json({ message: "URL not found" });
    }
    // Increment click count
    urlData.clickCount += 1;
    await urlData.save();
    res.redirect(urlData.originalUrl); // Redirect to the original URL
  } catch (error) {
    console.error("Error fetching URL:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
