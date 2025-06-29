import express from "express";
import connectDB from "./db.js";
import userRoutes from "./routes/user.route.js";
import urlRouter from "./routes/url.route.js";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Logging middleware for development
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  
  })
);

connectDB();

app.use("/user", userRoutes);
app.use("/", urlRouter);

app.get("/", (req, res) => {
  res.send(
    `<h1>Welcome to the URL Shortener API</h1>
     <p>Use the endpoints to shorten URLs, manage users, and more.</p>`
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
