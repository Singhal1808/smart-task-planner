# Smart Task Planner - API Documentation

## Overview
Smart Task Planner API provides endpoints for managing tasks, handling authentication, and generating execution plans based on task dependencies.

**Base URL:** `http://localhost:5000`

**Content-Type:** `application/json`

---

## Authentication

### Overview
The API uses token-based authentication. After login, include the token in the `Authorization` header for all protected endpoints.

**Token Format:** `Authorization: Bearer <token>`

**Token Expiry:** 24 hours

---

## Endpoints

### 1. Authentication Endpoints

#### 1.1 Login
**POST** `/auth/login`

Authenticate user and receive a session token.

**Auth Required:** No

**Request Body:**
```json
{
  "email": "demo@example.com",
  "password": "demo123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "fe944c7863275fd94fb46e47a11302b4ff5ee20833dcfa5e905170d46833877d",
  "email": "demo@example.com"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'
```

---

#### 1.2 Logout
**POST** `/auth/logout`

Logout current user and invalidate session token.

**Auth Required:** Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "No token provided"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 1.3 Get Current User
**GET** `/auth/me`

Get information about the currently logged-in user.

**Auth Required:** Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "email": "demo@example.com",
  "loginTime": "2026-07-07T00:30:15.123Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 1.4 Get Demo Credentials
**GET** `/auth/demo-credentials`

Get available demo credentials for testing.

**Auth Required:** No

**Response (200 OK):**
```json
{
  "demoAccounts": [
    {
      "email": "demo@example.com",
      "password": "demo123"
    },
    {
      "email": "user@example.com",
      "password": "password123"
    }
  ]
}
```

**Example cURL:**
```bash
curl http://localhost:5000/auth/demo-credentials
```

---

### 2. Task Endpoints

#### 2.1 Get All Tasks
**GET** `/tasks`

Retrieve all tasks.

**Auth Required:** Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:** None

**Response (200 OK):**
```json
[
  {
    "id": "T1",
    "title": "Setup Project",
    "description": "Initialize React and Node project",
    "priority": "High",
    "estimatedEffort": 2,
    "category": "Setup",
    "dependencies": [],
    "status": "To Do"
  },
  {
    "id": "T2",
    "title": "Build API",
    "description": "Develop REST APIs",
    "priority": "High",
    "estimatedEffort": 5,
    "category": "Backend",
    "dependencies": ["T1"],
    "status": "To Do"
  }
]
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "No token provided"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:5000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 2.2 Get Single Task
**GET** `/tasks/{id}`

Retrieve a specific task by ID.

**Auth Required:** Yes

**Path Parameters:**
- `id` (string): Task ID (e.g., "T1")

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "T1",
  "title": "Setup Project",
  "description": "Initialize React and Node project",
  "priority": "High",
  "estimatedEffort": 2,
  "category": "Setup",
  "dependencies": [],
  "status": "To Do"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Task not found"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:5000/tasks/T1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 2.3 Create Task
**POST** `/tasks`

Create a new task.

**Auth Required:** Yes

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Create login form",
  "description": "Build user login interface",
  "priority": "High",
  "estimatedEffort": 4,
  "category": "Frontend",
  "status": "To Do"
}
```

**Response (201 Created):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "T4",
    "title": "Create login form",
    "description": "Build user login interface",
    "priority": "High",
    "estimatedEffort": 4,
    "category": "Frontend",
    "dependencies": [],
    "status": "To Do"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Task title is required"
}
```

**Validation Rules:**
- `title` (required): Non-empty string
- `description` (optional): String
- `priority` (required): "High", "Medium", or "Low"
- `estimatedEffort` (required): Positive number
- `category` (optional): String
- `status` (required): "To Do", "In Progress", or "Done"

**Example cURL:**
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Create login form",
    "description": "Build user login interface",
    "priority": "High",
    "estimatedEffort": 4,
    "category": "Frontend",
    "status": "To Do"
  }'
```

---

#### 2.4 Update Task
**PUT** `/tasks/{id}`

Update an existing task.

**Auth Required:** Yes

**Path Parameters:**
- `id` (string): Task ID (e.g., "T1")

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Setup Project - Updated",
  "description": "Initialize React and Node project with authentication",
  "priority": "High",
  "estimatedEffort": 3,
  "category": "Setup",
  "status": "In Progress"
}
```

**Response (200 OK):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": "T1",
    "title": "Setup Project - Updated",
    "description": "Initialize React and Node project with authentication",
    "priority": "High",
    "estimatedEffort": 3,
    "category": "Setup",
    "dependencies": [],
    "status": "In Progress"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Task not found"
}
```

**Example cURL:**
```bash
curl -X PUT http://localhost:5000/tasks/T1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Setup Project - Updated",
    "priority": "High",
    "estimatedEffort": 3,
    "category": "Setup",
    "status": "In Progress"
  }'
```

---

#### 2.5 Delete Task
**DELETE** `/tasks/{id}`

Delete a task.

**Auth Required:** Yes

**Path Parameters:**
- `id` (string): Task ID (e.g., "T1")

**Query Parameters:**
- `force` (optional, boolean): Force delete even if other tasks depend on it

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Response (400 Bad Request - Has Dependents):**
```json
{
  "message": "Cannot delete task because other tasks depend on it"
}
```

To force delete (removes from dependent tasks):
```bash
curl -X DELETE "http://localhost:5000/tasks/T1?force=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example cURL:**
```bash
curl -X DELETE http://localhost:5000/tasks/T1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 2.6 Update Task Dependencies
**PUT** `/tasks/{id}/dependencies`

Update the dependencies of a task.

**Auth Required:** Yes

**Path Parameters:**
- `id` (string): Task ID (e.g., "T3")

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "dependencies": ["T1", "T2"]
}
```

**Response (200 OK):**
```json
{
  "message": "Dependencies updated successfully",
  "task": {
    "id": "T3",
    "title": "Build UI",
    "description": "Create frontend screens",
    "priority": "Medium",
    "estimatedEffort": 3,
    "category": "Frontend",
    "dependencies": ["T1", "T2"],
    "status": "To Do"
  }
}
```

**Error Response (400 Bad Request - Circular Dependency):**
```json
{
  "message": "Circular dependency detected: T1 depends on T2, T2 depends on T1"
}
```

**Error Response (400 Bad Request - Invalid Reference):**
```json
{
  "message": "Task T99 does not exist"
}
```

**Validation Rules:**
- Cannot depend on non-existent tasks
- Cannot create circular dependencies
- Cannot depend on itself

**Example cURL:**
```bash
curl -X PUT http://localhost:5000/tasks/T3/dependencies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dependencies": ["T1", "T2"]}'
```

---

### 3. Execution Plan Endpoint

#### 3.1 Generate Execution Plan
**GET** `/execution-plan`

Generate the recommended task execution order based on dependencies and business rules.

**Auth Required:** Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "T1",
    "title": "Setup Project",
    "description": "Initialize React and Node project",
    "priority": "High",
    "estimatedEffort": 2,
    "category": "Setup",
    "dependencies": [],
    "status": "To Do"
  },
  {
    "id": "T2",
    "title": "Build API",
    "description": "Develop REST APIs",
    "priority": "High",
    "estimatedEffort": 5,
    "category": "Backend",
    "dependencies": ["T1"],
    "status": "To Do"
  },
  {
    "id": "T3",
    "title": "Build UI",
    "description": "Create frontend screens",
    "priority": "Medium",
    "estimatedEffort": 3,
    "category": "Frontend",
    "dependencies": ["T2"],
    "status": "To Do"
  }
]
```

**Error Response (400 Bad Request - Circular Dependency):**
```json
{
  "message": "Circular dependency detected: Tasks T1 and T2 form a cycle"
}
```

**Ordering Rules:**
1. All dependencies come before dependent tasks
2. Higher priority first
3. If priority is same, lower effort first
4. If still tied, sort by task ID

**Example cURL:**
```bash
curl -X GET http://localhost:5000/execution-plan \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
Sent when request validation fails.

```json
{
  "message": "Task title is required"
}
```

#### 401 Unauthorized
Sent when authentication fails or token is invalid/expired.

```json
{
  "message": "Invalid or expired token"
}
```

#### 404 Not Found
Sent when requested resource doesn't exist.

```json
{
  "message": "Task not found"
}
```

#### 500 Internal Server Error
Sent when server encounters an error.

```json
{
  "message": "Server error: ..."
}
```

---

## Authentication Examples

### Complete Login Flow

```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Use token to get all tasks
curl -X GET http://localhost:5000/tasks \
  -H "Authorization: Bearer $TOKEN"

# 3. Logout
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

## Task Model

### Task Object Structure

```json
{
  "id": "T1",
  "title": "Setup Project",
  "description": "Initialize React and Node project",
  "priority": "High",
  "estimatedEffort": 2,
  "category": "Setup",
  "dependencies": ["T0"],
  "status": "To Do"
}
```

### Field Descriptions

| Field | Type | Description | Valid Values |
|-------|------|-------------|--------------|
| `id` | string | Unique task identifier | Auto-generated (T1, T2, ...) |
| `title` | string | Task name | Any non-empty string |
| `description` | string | Task details | Any string |
| `priority` | string | Task priority level | "High", "Medium", "Low" |
| `estimatedEffort` | number | Effort estimate | Positive integer |
| `category` | string | Task category/type | Any string |
| `dependencies` | array | Task IDs this task depends on | Array of valid task IDs |
| `status` | string | Current task status | "To Do", "In Progress", "Done" |

---

## Demo Credentials

For testing, use these pre-configured accounts:

```
Email: demo@example.com
Password: demo123

OR

Email: user@example.com
Password: password123
```

---

## Notes

- **In-Memory Storage:** All data is stored in memory and resets when the server restarts
- **Token Expiry:** Tokens expire after 24 hours
- **No CORS Issues:** CORS is enabled for all origins
- **Content-Type:** All requests expect and return `application/json`
- **Circular Dependencies:** The API automatically detects and prevents circular dependencies

---

## Version
API Version: 1.0
Last Updated: 2026-07-07
