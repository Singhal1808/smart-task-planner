import assert from "node:assert/strict";
import test from "node:test";
import {
  validateTask,
  validateDependencies,
} from "../utils/validation.js";

test("validateTask accepts valid task data", () => {
  const validTask = {
    title: "Valid Task",
    description: "A valid task",
    priority: "High",
    estimatedEffort: 5,
    category: "Development",
    status: "To Do",
  };

  const error = validateTask(validTask);
  assert.equal(error, null);
});

test("validateTask rejects empty title", () => {
  const invalidTask = {
    title: "",
    priority: "High",
    estimatedEffort: 5,
    status: "To Do",
  };

  const error = validateTask(invalidTask);
  assert.ok(error);
  assert.ok(error.toLowerCase().includes("title"));
});

test("validateTask rejects missing title", () => {
  const invalidTask = {
    priority: "High",
    estimatedEffort: 5,
    status: "To Do",
  };

  const error = validateTask(invalidTask);
  assert.ok(error);
});

test("validateTask rejects invalid priority", () => {
  const invalidTask = {
    title: "Task",
    priority: "SuperHigh",
    estimatedEffort: 5,
    status: "To Do",
  };

  const error = validateTask(invalidTask);
  assert.ok(error);
  assert.ok(error.includes("priority"));
});

test("validateTask accepts all valid priorities", () => {
  const priorities = ["High", "Medium", "Low"];

  for (const priority of priorities) {
    const task = {
      title: "Task",
      priority,
      estimatedEffort: 5,
      status: "To Do",
    };

    const error = validateTask(task);
    assert.equal(error, null);
  }
});

test("validateTask rejects invalid status", () => {
  const invalidTask = {
    title: "Task",
    priority: "High",
    estimatedEffort: 5,
    status: "Invalid Status",
  };

  const error = validateTask(invalidTask);
  assert.ok(error);
  assert.ok(error.includes("status"));
});

test("validateTask accepts all valid statuses", () => {
  const statuses = ["To Do", "In Progress", "Done"];

  for (const status of statuses) {
    const task = {
      title: "Task",
      priority: "High",
      estimatedEffort: 5,
      status,
    };

    const error = validateTask(task);
    assert.equal(error, null);
  }
});

test("validateTask rejects non-numeric effort", () => {
  const invalidTask = {
    title: "Task",
    priority: "High",
    estimatedEffort: "five",
    status: "To Do",
  };

  const error = validateTask(invalidTask);
  assert.ok(error);
  assert.ok(error.includes("Effort"));
});

test("validateTask rejects negative effort", () => {
  const invalidTask = {
    title: "Task",
    priority: "High",
    estimatedEffort: -5,
    status: "To Do",
  };

  const error = validateTask(invalidTask);
  assert.ok(error);
});

test("validateTask rejects zero effort", () => {
  const invalidTask = {
    title: "Task",
    priority: "High",
    estimatedEffort: 0,
    status: "To Do",
  };

  const error = validateTask(invalidTask);
  assert.ok(error);
});

test("validateDependencies accepts valid dependencies", () => {
  const tasks = [
    { id: "T1", title: "Task 1", dependencies: [] },
    { id: "T2", title: "Task 2", dependencies: [] },
    { id: "T3", title: "Task 3", dependencies: [] },
  ];

  const error = validateDependencies("T3", ["T1", "T2"], tasks);
  assert.equal(error, null);
});

test("validateDependencies rejects self-dependency", () => {
  const tasks = [{ id: "T1", title: "Task 1", dependencies: [] }];

  const error = validateDependencies("T1", ["T1"], tasks);
  assert.ok(error);
  assert.ok(error.includes("cannot depend on itself"));
});

test("validateDependencies rejects non-existent dependency", () => {
  const tasks = [{ id: "T1", title: "Task 1", dependencies: [] }];

  const error = validateDependencies("T1", ["T99"], tasks);
  assert.ok(error);
  assert.ok(error.includes("T99"));
  assert.ok(error.includes("does not exist"));
});

test("validateDependencies rejects empty dependency references", () => {
  const tasks = [
    { id: "T1", title: "Task 1", dependencies: [] },
    { id: "T2", title: "Task 2", dependencies: [] },
  ];

  // Empty string is not a valid task ID
  const error = validateDependencies("T1", [""], tasks);
  assert.ok(error);
});

test("validateDependencies accepts multiple valid dependencies", () => {
  const tasks = [
    { id: "T1", title: "Task 1", dependencies: [] },
    { id: "T2", title: "Task 2", dependencies: [] },
    { id: "T3", title: "Task 3", dependencies: [] },
    { id: "T4", title: "Task 4", dependencies: [] },
  ];

  const error = validateDependencies("T4", ["T1", "T2", "T3"], tasks);
  assert.equal(error, null);
});

test("validateDependencies accepts empty dependency array", () => {
  const tasks = [{ id: "T1", title: "Task 1", dependencies: [] }];

  const error = validateDependencies("T1", [], tasks);
  assert.equal(error, null);
});
