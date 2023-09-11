import express from "express";
import authUser from "../middlewares/authMiddleware.js";
import { updateUserController } from "../controllers/userController.js";
import { getUserController } from "../controllers/authController.js";

const router = express.Router();

// Get user data || POST request
router.post("/getuser", authUser, getUserController);

// PUT REQUEST || UPDATE USER
router.put("/update-user", authUser, updateUserController);

export default router;
