import { Router } from "express";
import { createUrl, getUrlByShortId} from "../controllers/url.controller.js";

const urlRouter = Router();

// Define the route for URL shortening
urlRouter.post("/shorten", createUrl);

// Define the route for getting URL by short ID
urlRouter.get("/:shortId", getUrlByShortId);

// Export the URL router
export default urlRouter;
