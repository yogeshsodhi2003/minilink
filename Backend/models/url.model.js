import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true, // ensures no duplicates like 'abc123'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ⬅️ Only if you have auth
      required: false,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: { expires: 0 }, // TTL index → Mongo will auto-delete
    },
  },
  {
    timestamps: true, // Adds createdAt + updatedAt fields
  }
);

const Url = mongoose.model("Url", urlSchema);
export default Url;
