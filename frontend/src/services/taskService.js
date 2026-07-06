const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "/tasks";

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function getAllTasks() {
  const response = await fetch(BASE_URL);

  return parseResponse(response);
}

export async function createTask(task) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return parseResponse(response);
}

export async function deleteTask(taskId, force = false) {
  const query = force ? "?force=true" : "";
  const response = await fetch(`${BASE_URL}/${taskId}${query}`, {
    method: "DELETE",
  });

  return parseResponse(response);
}

export async function updateTask(taskId, task) {
  const response = await fetch(`${BASE_URL}/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return parseResponse(response);
}

export async function updateTaskDependencies(taskId, dependencies) {
  const response = await fetch(`${BASE_URL}/${taskId}/dependencies`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dependencies }),
  });

  return parseResponse(response);
}

export async function getExecutionPlan() {
  const response = await fetch("/execution-plan");

  return parseResponse(response);
}
