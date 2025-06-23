import url from "../models/url.model.js";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import User from "../models/user.model.js";
// Create a new URL

export const createUrl = async (req, res) => {
  const { originalUrl, customSlug, userId } = req.body;
  // if (!isValidUrl(originalUrl)) {
  //     return res.status(400).json({ message: "Invalid URL format" });
  // }
  try {

  let shortId;

  if (customSlug) {
    const existing = await url.findOne({ shortId: customSlug });
    if (existing) {
      return res.status(400).json({ message: "Custom slug already in use" });
    }
    shortId = customSlug;
  } else {
    shortId = nanoid(6);
  }
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

export const getUserUrls = async (req, res) => {
  const userId = req.params.userId; // Assuming user ID is attached to the request
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const urls = await url.find({ user: userId });
    res.status(200).json(urls);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUrl = async (req, res) => {
  const { id } = req.params; // Assuming URL ID is passed as a parameter
  try {
    const deletedUrl = await url.findByIdAndDelete(id);
    if (!deletedUrl) {
      return res.status(404).json({ message: "URL not found" });
    }
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
