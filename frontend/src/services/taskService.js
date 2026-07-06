const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "/tasks";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function getAllTasks() {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}

export async function createTask(task) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  return parseResponse(response);
}

export async function deleteTask(taskId, force = false) {
  const query = force ? "?force=true" : "";
  const response = await fetch(`${BASE_URL}/${taskId}${query}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}

export async function updateTask(taskId, task) {
  const response = await fetch(`${BASE_URL}/${taskId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  return parseResponse(response);
}

export async function updateTaskDependencies(taskId, dependencies) {
  const response = await fetch(`${BASE_URL}/${taskId}/dependencies`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ dependencies }),
  });

  return parseResponse(response);
}

export async function getExecutionPlan() {
  const response = await fetch("/execution-plan", {
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}
