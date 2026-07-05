import tasks from "../models/taskModel.js";
import { validateDependencies, validateTask } from "../utils/validation.js";

let nextTaskNumber =
  Math.max(...tasks.map((task) => Number(task.id.substring(1))), 0) + 1;

export function getAllTasksService() {
  return tasks;
}

export function getTaskByIdService(id) {
  return tasks.find((task) => task.id === id);
}

function generateTaskId() {
  const id = `T${nextTaskNumber}`;
  nextTaskNumber += 1;
  return id;
}

function normalizeTaskDetails(task) {
  return {
    title: task.title?.trim() ?? "",
    description: task.description ?? "",
    priority: task.priority,
    estimatedEffort: Number(task.estimatedEffort),
    category: task.category ?? "",
    status: task.status,
  };
}

export function createTaskService(task) {
  const taskDetails = normalizeTaskDetails(task);
  const error = validateTask(taskDetails);

  if (error) {
    throw new Error(error);
  }

  const newTask = {
    id: generateTaskId(),
    ...taskDetails,
    dependencies: [],
  };

  tasks.push(newTask);

  return newTask;
}

export function updateTaskService(id, updatedTask) {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  const taskDetails = normalizeTaskDetails(updatedTask);
  const error = validateTask(taskDetails);

  if (error) {
    throw new Error(error);
  }

  tasks[index] = {
    ...tasks[index],
    ...taskDetails,
    id,
  };

  return tasks[index];
}

export function updateDependenciesService(id, dependencies) {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return null;
  }

  const error = validateDependencies(id, dependencies, tasks);

  if (error) {
    throw new Error(error);
  }

  task.dependencies = dependencies;

  return task;
}

export function deleteTaskService(id, force = false) {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return { deleted: false, reason: "not-found" };
  }

  const hasDependentTasks = tasks.some((task) => task.dependencies.includes(id));

  if (hasDependentTasks && !force) {
    return { deleted: false, reason: "has-dependents" };
  }

  tasks.splice(index, 1);

  if (force) {
    for (const task of tasks) {
      task.dependencies = task.dependencies.filter((dependency) => dependency !== id);
    }
  }

  return { deleted: true };
}
