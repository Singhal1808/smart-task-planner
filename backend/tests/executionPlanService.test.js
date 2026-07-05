import assert from "node:assert/strict";
import test from "node:test";
import { generateExecutionPlan } from "../services/executionPlanService.js";
import { validateDependencies } from "../utils/validation.js";

function task(id, title, priority, estimatedEffort, dependencies = []) {
  return {
    id,
    title,
    description: "",
    priority,
    estimatedEffort,
    category: "",
    dependencies,
    status: "To Do",
  };
}

test("generates a simple dependency chain in dependency-first order", () => {
  const tasks = [
    task("T1", "Setup project", "High", 2),
    task("T2", "Build API", "High", 5, ["T1"]),
    task("T3", "Build UI", "Medium", 3, ["T2"]),
  ];

  const plan = generateExecutionPlan(tasks);

  assert.deepEqual(
    plan.map((item) => item.id),
    ["T1", "T2", "T3"],
  );
});

test("orders available tasks by priority, effort, then task id", () => {
  const tasks = [
    task("T1", "Setup project", "High", 2),
    task("T2", "Create login API", "High", 5, ["T1"]),
    task("T3", "Create dashboard UI", "Medium", 3, ["T1"]),
    task("T4", "Write unit tests", "High", 2, ["T1"]),
    task("T5", "Document API", "High", 2, ["T1"]),
  ];

  const plan = generateExecutionPlan(tasks);

  assert.deepEqual(
    plan.map((item) => item.id),
    ["T1", "T4", "T5", "T2", "T3"],
  );
});

test("detects circular dependencies", () => {
  const tasks = [
    task("T1", "Design UI", "High", 2, ["T3"]),
    task("T2", "Build API", "High", 3, ["T1"]),
    task("T3", "Integrate UI with API", "Medium", 2, ["T2"]),
  ];

  assert.throws(
    () => generateExecutionPlan(tasks),
    /Cannot generate execution plan\. Dependency cycle detected\./,
  );
});

test("rejects dependency updates when a task depends on itself", () => {
  const tasks = [task("T1", "Setup project", "High", 2)];

  assert.equal(
    validateDependencies("T1", ["T1"], tasks),
    "Task cannot depend on itself.",
  );
});

test("rejects dependency updates that reference missing tasks", () => {
  const tasks = [task("T1", "Setup project", "High", 2)];

  assert.equal(
    validateDependencies("T1", ["T99"], tasks),
    "Dependency T99 does not exist.",
  );
});
