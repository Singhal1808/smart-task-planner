const PRIORITIES = ["High", "Medium", "Low"];
const STATUS = ["To Do", "In Progress", "Done"];

export function validateTask(task) {
  if (!task.title || !task.title.trim()) {
    return "Task Title is required.";
  }

  if (!PRIORITIES.includes(task.priority)) {
    return "Invalid priority.";
  }

  if (
    !Number.isInteger(task.estimatedEffort) ||
    task.estimatedEffort <= 0
  ) {
    return "Estimated Effort must be a positive integer.";
  }

  if (!STATUS.includes(task.status)) {
    return "Invalid status.";
  }

  return null;
}

export function validateDependencies(taskId, dependencies, existingTasks) {
  if (!Array.isArray(dependencies)) {
    return "Dependencies must be an array.";
  }

  if (new Set(dependencies).size !== dependencies.length) {
    return "Duplicate dependencies are not allowed.";
  }

  if (dependencies.includes(taskId)) {
    return "Task cannot depend on itself.";
  }

  for (const dependency of dependencies) {
    const exists = existingTasks.some((task) => task.id === dependency);

    if (!exists) return `Dependency ${dependency} does not exist.`;
  }

  return null;
}
