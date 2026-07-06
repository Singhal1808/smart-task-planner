import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import executionPlanRoutes from "./routes/executionPlanRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./controllers/authController.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// API Routes
console.log("Mounting auth routes...");
app.use("/auth", authRoutes);
console.log("Auth routes registered");
console.log("Auth routes mounted");
app.use("/tasks", verifyToken, taskRoutes);
app.use("/execution-plan", verifyToken, executionPlanRoutes);
console.log("All API routes mounted");

// Frontend - Serve static files and catch-all
const frontendDistPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Catch-all for SPA - return index.html for non-API routes
  app.use((req, res) => {
    // Don't serve index.html for API calls that weren't matched
    if (req.path.startsWith("/auth") || req.path.startsWith("/tasks") || req.path.startsWith("/execution-plan")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  // Fallback if frontend dist doesn't exist
  app.get("/", (req, res) => {
    res.send("Smart Task Planner Backend is Running...");
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});