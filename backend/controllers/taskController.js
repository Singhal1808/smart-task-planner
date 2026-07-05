import {
  getAllTasksService,
  getTaskByIdService,
  createTaskService,
  updateTaskService,
  updateDependenciesService,
  deleteTaskService,
} from "../services/taskService.js";

export function getAllTasks(req, res) {
  const taskList = getAllTasksService();
  res.json(taskList);
}

export function getTaskById(req, res) {
  const { id } = req.params;
  const task = getTaskByIdService(id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
}

export function createTask(req, res) {
  try {
    const task = createTaskService(req.body);
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updatedTask = updateTaskService(id, req.body);

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export function updateDependencies(req, res) {
  try {
    const { id } = req.params;
    const { dependencies } = req.body;

    const task = updateDependenciesService(id, dependencies);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Dependencies updated successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export function deleteTask(req, res) {
  const { id } = req.params;
  const force = req.query.force === "true";
  const result = deleteTaskService(id, force);

  if (result.reason === "not-found") {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (result.reason === "has-dependents") {
    return res.status(409).json({
      message: "Cannot delete task because other tasks depend on it.",
    });
  }

  res.json({
    message: "Task deleted successfully",
  });
}
