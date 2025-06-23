import { Router } from "express";
import {
  createUrl,
  getUrlByShortId,
  getUserUrls,
    deleteUrl
} from "../controllers/url.controller.js";

const urlRouter = Router();

// Define the route for URL shortening
urlRouter.post("/shorten", createUrl);

// Define the route for getting URL by short ID
urlRouter.get("/:shortId", getUrlByShortId);

// Define the route for getting user URLs
urlRouter.get("/allurls/:userId", getUserUrls); // Assuming userId is passed as a query parameter

// Define the route for deleting a URL
urlRouter.delete("/:id", deleteUrl); // Assuming URL ID is passed as a parameter


// Export the URL router
export default urlRouter;
