import assert from "node:assert/strict";
import test from "node:test";
import {
  getAllTasksService,
  getTaskByIdService,
  createTaskService,
  updateTaskService,
  updateDependenciesService,
  deleteTaskService,
} from "../services/taskService.js";

// Reset tasks before each test
function resetTasks() {
  // Note: In a real test suite, we'd need to reset the module state
  // For now, we're testing with the default seed data
}

test("getAllTasksService returns all tasks", () => {
  const tasks = getAllTasksService();

  assert.ok(Array.isArray(tasks));
  assert.ok(tasks.length > 0);
  assert.ok(tasks[0].id);
  assert.ok(tasks[0].title);
});

test("getTaskByIdService retrieves a specific task", () => {
  const task = getTaskByIdService("T1");

  assert.ok(task);
  assert.equal(task.id, "T1");
  assert.equal(task.title, "Setup Project");
});

test("getTaskByIdService returns null for non-existent task", () => {
  const task = getTaskByIdService("T999");

  assert.equal(task, undefined);
});

test("createTaskService creates a new task with valid data", () => {
  const newTask = {
    title: "Test Task",
    description: "A test task",
    priority: "High",
    estimatedEffort: 5,
    category: "Testing",
    status: "To Do",
  };

  const createdTask = createTaskService(newTask);

  assert.ok(createdTask.id);
  assert.equal(createdTask.title, "Test Task");
  assert.equal(createdTask.priority, "High");
  assert.equal(createdTask.estimatedEffort, 5);
  assert.deepEqual(createdTask.dependencies, []);
});

test("createTaskService throws error when title is missing", () => {
  const invalidTask = {
    description: "A test task",
    priority: "High",
    estimatedEffort: 5,
    category: "Testing",
    status: "To Do",
  };

  assert.throws(
    () => createTaskService(invalidTask),
    /Task Title is required/
  );
});

test("createTaskService throws error for invalid priority", () => {
  const invalidTask = {
    title: "Test Task",
    priority: "UltraHigh",
    estimatedEffort: 5,
    category: "Testing",
    status: "To Do",
  };

  assert.throws(
    () => createTaskService(invalidTask),
    /Invalid priority/
  );
});

test("createTaskService throws error for invalid status", () => {
  const invalidTask = {
    title: "Test Task",
    priority: "High",
    estimatedEffort: 5,
    status: "Invalid Status",
  };

  assert.throws(
    () => createTaskService(invalidTask),
    /Invalid status/
  );
});

test("createTaskService throws error for non-numeric effort", () => {
  const invalidTask = {
    title: "Test Task",
    priority: "High",
    estimatedEffort: "not a number",
    status: "To Do",
  };

  assert.throws(
    () => createTaskService(invalidTask)
  );
});

test("updateTaskService updates task successfully", () => {
  const updates = {
    title: "Updated Title",
    priority: "Medium",
    estimatedEffort: 3,
    status: "In Progress",
  };

  const updatedTask = updateTaskService("T1", updates);

  assert.equal(updatedTask.id, "T1");
  assert.equal(updatedTask.title, "Updated Title");
  assert.equal(updatedTask.priority, "Medium");
  assert.equal(updatedTask.status, "In Progress");
});

test("updateTaskService returns null for non-existent task", () => {
  const result = updateTaskService("T999", { title: "New Title" });

  assert.equal(result, null);
});

test("updateTaskService throws error for invalid data", () => {
  assert.throws(
    () => updateTaskService("T1", {
      title: "Task",
      priority: "InvalidPriority",
      estimatedEffort: 5,
      status: "To Do"
    }),
    /Invalid priority/
  );
});

test("updateDependenciesService updates dependencies successfully", () => {
  const result = updateDependenciesService("T3", ["T1", "T2"]);

  assert.ok(result);
  assert.deepEqual(result.dependencies, ["T1", "T2"]);
});

test("updateDependenciesService throws error for self-dependency", () => {
  assert.throws(
    () => updateDependenciesService("T1", ["T1"]),
    /Task cannot depend on itself/
  );
});

test("updateDependenciesService throws error for non-existent dependency", () => {
  assert.throws(
    () => updateDependenciesService("T1", ["T999"]),
    /Dependency T999 does not exist/
  );
});

test("deleteTaskService deletes task successfully", () => {
  const newTask = createTaskService({
    title: "Task to Delete",
    priority: "Low",
    estimatedEffort: 1,
    status: "To Do",
  });

  const result = deleteTaskService(newTask.id);

  assert.ok(result.deleted);
  assert.equal(getTaskByIdService(newTask.id), undefined);
});

test("deleteTaskService prevents deletion of task with dependents", () => {
  // T2 depends on T1, so we can't delete T1 without force
  const result = deleteTaskService("T1");

  assert.equal(result.deleted, false);
  assert.equal(result.reason, "has-dependents");
});

test("deleteTaskService force-deletes task and removes from dependencies", () => {
  const newTask1 = createTaskService({
    title: "Task 1",
    priority: "High",
    estimatedEffort: 2,
    status: "To Do",
  });

  const newTask2 = createTaskService({
    title: "Task 2",
    priority: "High",
    estimatedEffort: 3,
    status: "To Do",
  });

  updateDependenciesService(newTask2.id, [newTask1.id]);

  const result = deleteTaskService(newTask1.id, true);

  assert.ok(result.deleted);
  const task2 = getTaskByIdService(newTask2.id);
  assert.equal(task2.dependencies.includes(newTask1.id), false);
});

test("deleteTaskService returns not-found for non-existent task", () => {
  const result = deleteTaskService("T999");

  assert.equal(result.deleted, false);
  assert.equal(result.reason, "not-found");
});

test("createTaskService trims whitespace from title", () => {
  const task = createTaskService({
    title: "  Task with spaces  ",
    priority: "High",
    estimatedEffort: 2,
    status: "To Do",
  });

  assert.equal(task.title, "Task with spaces");
});

test("createTaskService handles missing optional fields", () => {
  const task = createTaskService({
    title: "Minimal Task",
    priority: "Medium",
    estimatedEffort: 1,
    status: "To Do",
  });

  assert.equal(task.description, "");
  assert.equal(task.category, "");
  assert.deepEqual(task.dependencies, []);
});
