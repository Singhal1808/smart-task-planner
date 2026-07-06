import assert from "node:assert/strict";
import test from "node:test";
import { generateExecutionPlan } from "../services/executionPlanService.js";

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

test("handles empty task list", () => {
  const tasks = [];
  const plan = generateExecutionPlan(tasks);

  assert.deepEqual(plan, []);
});

test("handles single task with no dependencies", () => {
  const tasks = [task("T1", "Single task", "High", 2)];
  const plan = generateExecutionPlan(tasks);

  assert.deepEqual(plan.map((t) => t.id), ["T1"]);
});

test("handles multiple tasks with no dependencies (sorts by priority and effort)", () => {
  const tasks = [
    task("T1", "Task 1", "Low", 5),
    task("T2", "Task 2", "High", 2),
    task("T3", "Task 3", "Medium", 3),
    task("T4", "Task 4", "High", 1),
  ];

  const plan = generateExecutionPlan(tasks);

  // Expected order: T4 (High, 1), T2 (High, 2), T3 (Medium, 3), T1 (Low, 5)
  assert.deepEqual(plan.map((t) => t.id), ["T4", "T2", "T3", "T1"]);
});

test("respects dependency order while sorting by priority and effort", () => {
  const tasks = [
    task("T1", "Setup", "High", 2),
    task("T2", "API", "Medium", 5, ["T1"]),
    task("T3", "UI", "High", 3, ["T1"]),
    task("T4", "Tests", "High", 2, ["T1"]),
  ];

  const plan = generateExecutionPlan(tasks);

  // T1 must come first (no dependencies)
  // Then T4, T3, T2 (sorted by priority and effort)
  assert.equal(plan[0].id, "T1");
  assert.deepEqual(
    plan.map((t) => t.id),
    ["T1", "T4", "T3", "T2"]
  );
});

test("handles long dependency chains", () => {
  const tasks = [
    task("T1", "Step 1", "High", 1),
    task("T2", "Step 2", "High", 1, ["T1"]),
    task("T3", "Step 3", "High", 1, ["T2"]),
    task("T4", "Step 4", "High", 1, ["T3"]),
    task("T5", "Step 5", "High", 1, ["T4"]),
  ];

  const plan = generateExecutionPlan(tasks);

  assert.deepEqual(
    plan.map((t) => t.id),
    ["T1", "T2", "T3", "T4", "T5"]
  );
});

test("handles diamond dependency pattern", () => {
  const tasks = [
    task("T1", "Root", "High", 1),
    task("T2", "Left", "High", 1, ["T1"]),
    task("T3", "Right", "High", 1, ["T1"]),
    task("T4", "Merge", "High", 1, ["T2", "T3"]),
  ];

  const plan = generateExecutionPlan(tasks);

  // T1 first
  assert.equal(plan[0].id, "T1");
  // T2 and T3 can be anywhere after T1
  assert.ok(["T2", "T3"].includes(plan[1].id));
  assert.ok(["T2", "T3"].includes(plan[2].id));
  // T4 must be last
  assert.equal(plan[3].id, "T4");
});

test("handles multiple independent chains", () => {
  const tasks = [
    // Chain 1
    task("T1", "Setup", "High", 2),
    task("T2", "Build", "High", 5, ["T1"]),
    // Chain 2
    task("T3", "Test setup", "Medium", 1),
    task("T4", "Test run", "Medium", 3, ["T3"]),
  ];

  const plan = generateExecutionPlan(tasks);

  // T1 and T3 can be first (no dependencies)
  assert.ok(["T1", "T3"].includes(plan[0].id));

  // Check that dependencies are respected
  const ids = plan.map((t) => t.id);
  assert.ok(ids.indexOf("T1") < ids.indexOf("T2"));
  assert.ok(ids.indexOf("T3") < ids.indexOf("T4"));
});

test("detects 2-node circular dependency", () => {
  const tasks = [
    task("T1", "Task 1", "High", 1, ["T2"]),
    task("T2", "Task 2", "High", 1, ["T1"]),
  ];

  assert.throws(
    () => generateExecutionPlan(tasks),
    /Dependency cycle detected/
  );
});

test("detects 3-node circular dependency", () => {
  const tasks = [
    task("T1", "Task 1", "High", 1, ["T3"]),
    task("T2", "Task 2", "High", 1, ["T1"]),
    task("T3", "Task 3", "High", 1, ["T2"]),
  ];

  assert.throws(
    () => generateExecutionPlan(tasks),
    /Dependency cycle detected/
  );
});

test("detects self-referential circular dependency", () => {
  const tasks = [
    task("T1", "Task 1", "High", 1, ["T1"]),
  ];

  assert.throws(
    () => generateExecutionPlan(tasks),
    /Dependency cycle detected/
  );
});

test("uses task ID as tiebreaker for same priority and effort", () => {
  const tasks = [
    task("T3", "Task 3", "High", 5),
    task("T1", "Task 1", "High", 5),
    task("T2", "Task 2", "High", 5),
  ];

  const plan = generateExecutionPlan(tasks);

  // All have same priority and effort, so should be sorted by ID
  assert.deepEqual(
    plan.map((t) => t.id),
    ["T1", "T2", "T3"]
  );
});

test("correctly orders all priority levels", () => {
  const tasks = [
    task("T1", "Low 1", "Low", 1),
    task("T2", "High 1", "High", 1),
    task("T3", "Medium 1", "Medium", 1),
    task("T4", "Low 2", "Low", 1),
    task("T5", "High 2", "High", 1),
    task("T6", "Medium 2", "Medium", 1),
  ];

  const plan = generateExecutionPlan(tasks);

  // All High (T2, T5) should come first
  assert.ok(["T2", "T5"].includes(plan[0].id));
  assert.ok(["T2", "T5"].includes(plan[1].id));

  // Then Medium (T3, T6)
  assert.ok(["T3", "T6"].includes(plan[2].id));
  assert.ok(["T3", "T6"].includes(plan[3].id));

  // Then Low (T1, T4)
  assert.ok(["T1", "T4"].includes(plan[4].id));
  assert.ok(["T1", "T4"].includes(plan[5].id));
});

test("handles large number of tasks", () => {
  const tasks = [];
  for (let i = 1; i <= 20; i++) {
    tasks.push(
      task(
        `T${i}`,
        `Task ${i}`,
        i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
        (i % 10) + 1,
        i > 1 ? [`T${i - 1}`] : []
      )
    );
  }

  const plan = generateExecutionPlan(tasks);

  assert.equal(plan.length, 20);
  // T1 should be first (no dependencies)
  assert.equal(plan[0].id, "T1");
});

test("verifies returned plan includes all original data", () => {
  const tasks = [
    {
      id: "T1",
      title: "Setup Project",
      description: "Initialize project",
      priority: "High",
      estimatedEffort: 2,
      category: "Setup",
      dependencies: [],
      status: "To Do",
    },
  ];

  const plan = generateExecutionPlan(tasks);

  assert.equal(plan[0].id, "T1");
  assert.equal(plan[0].title, "Setup Project");
  assert.equal(plan[0].description, "Initialize project");
  assert.equal(plan[0].category, "Setup");
});
