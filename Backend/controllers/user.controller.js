// Import necessary modules
import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    // Save the user to the database
    await user.save();
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.name, }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      message: "register successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);  
    res.status(500).json({ message: "Internal server error" });
  }
};
// Login a user

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.name, }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUserWithGoogle = async (req, res) => {
  const { email, name, picture, sub } = req.body;

  try {
    let user = await User.findOne({ email: email });

    // If user doesn't exist, create one
    if (!user) {
      console.log("User not found, creating new user");
      user = new User({
        name: name,
        email: email,
        password: sub, // Using sub as a unique identifier
      });
      await user.save();
      console.log("New user created:", user);
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id,  username: user.name }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
