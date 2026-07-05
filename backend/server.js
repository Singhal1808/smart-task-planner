import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import executionPlanRoutes from "./routes/executionPlanRoutes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Smart Task Planner Backend is Running...");
});
app.use("/tasks", taskRoutes);
app.use("/execution-plan", executionPlanRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
