import express from "express";
import { getExecutionPlan } from "../controllers/executionPlanController.js";

const router = express.Router();

router.get("/", getExecutionPlan);

export default router;
