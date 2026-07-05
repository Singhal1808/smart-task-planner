import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateDependencies,
  deleteTask,
} from "../controllers/taskController.js";
import { getExecutionPlan } from "../controllers/executionPlanController.js";

const router = express.Router();

router.get("/", getAllTasks);
router.get("/plan", getExecutionPlan);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.put("/:id/dependencies", updateDependencies);
router.delete("/:id", deleteTask);

export default router;
