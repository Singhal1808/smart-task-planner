import tasks from "../models/taskModel.js";
import PriorityQueue from "../utils/PriorityQueue.js";

function buildGraph(taskList) {
  const graph = new Map();

  for (const task of taskList) {
    graph.set(task.id, []);
  }

  for (const task of taskList) {
    for (const dependency of task.dependencies) {
      graph.get(dependency).push(task.id);
    }
  }

  return graph;
}

function buildIndegree(taskList) {
  const indegree = new Map();

  for (const task of taskList) {
    indegree.set(task.id, 0);
  }

  for (const task of taskList) {
    for (const dependency of task.dependencies) {
      indegree.set(task.id, indegree.get(task.id) + 1);
    }
  }

  return indegree;
}

function compareTasks(taskA, taskB) {
  const priorityWeight = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  if (priorityWeight[taskA.priority] !== priorityWeight[taskB.priority]) {
    return priorityWeight[taskB.priority] - priorityWeight[taskA.priority];
  }

  if (taskA.estimatedEffort !== taskB.estimatedEffort) {
    return taskA.estimatedEffort - taskB.estimatedEffort;
  }

  return taskA.id.localeCompare(taskB.id);
}

export function generateExecutionPlan(taskList = tasks) {
  const graph = buildGraph(taskList);
  const indegree = buildIndegree(taskList);
  const priorityQueue = new PriorityQueue(compareTasks);
  const executionPlan = [];

  for (const task of taskList) {
    if (indegree.get(task.id) === 0) {
      priorityQueue.enqueue(task);
    }
  }

  while (!priorityQueue.isEmpty()) {
    const currentTask = priorityQueue.dequeue();
    executionPlan.push(currentTask);

    for (const neighbourId of graph.get(currentTask.id)) {
      indegree.set(neighbourId, indegree.get(neighbourId) - 1);

      if (indegree.get(neighbourId) === 0) {
        const neighbourTask = taskList.find((task) => task.id === neighbourId);
        priorityQueue.enqueue(neighbourTask);
      }
    }
  }

  if (executionPlan.length !== taskList.length) {
    throw new Error("Cannot generate execution plan. Dependency cycle detected.");
  }

  return executionPlan;
}
