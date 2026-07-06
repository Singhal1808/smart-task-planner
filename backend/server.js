import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import executionPlanRoutes from "./routes/executionPlanRoutes.js";
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

app.get("/", (req, res) => {
  res.send("Smart Task Planner Backend is Running...");
});
app.use("/tasks", taskRoutes);
app.use("/execution-plan", executionPlanRoutes);
const frontendDistPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
