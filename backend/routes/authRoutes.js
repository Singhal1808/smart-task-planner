import express from "express";
import {
  login,
  logout,
  getCurrentUser,
  getDemoCredentials,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
router.get("/demo-credentials", getDemoCredentials);

export default router;
