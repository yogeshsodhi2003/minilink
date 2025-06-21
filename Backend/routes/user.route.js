import { Router } from "express";
import { registerUser , loginUser} from "../controllers/user.controller.js";

const router = Router();

// Define the route for user registration
router.post("/register", registerUser);

// Define the route for user login
router.post("/login", loginUser);

// Export the router
export default router;
