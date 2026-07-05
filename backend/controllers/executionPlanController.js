import { generateExecutionPlan } from "../services/executionPlanService.js";

export function getExecutionPlan(req, res) {
  try {
    const plan = generateExecutionPlan();
    res.json(plan);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}
