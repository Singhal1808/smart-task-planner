# Smart Task Planner

Smart Task Planner is a full-stack application for managing sprint tasks and generating a dependency-aware execution plan. The app features authentication, advanced filtering, sorting, and comprehensive task management capabilities.

The application uses a React frontend and a Node.js/Express backend with in-memory storage only. No database, file persistence, SQL, or NoSQL storage is required.

## Key Features

✅ **Authentication System**
- Mock authentication with secure token-based sessions
- Login/logout functionality
- 24-hour token expiration
- Session persistence across page reloads

✅ **Advanced Task Management**
- Create, read, update, and delete tasks
- Manage task dependencies with circular dependency detection
- View complete task details
- Force delete tasks with dependent children

✅ **Intelligent Filtering**
- Multi-select filters by Category, Priority, Status
- Dual-thumb effort range slider for numerical filtering
- Accordion-style filter interface with Apply/Cancel buttons
- Filter count badges
- Remove all filters button
- AND logic for combining multiple filters

✅ **Sorting Capabilities**
- Sort by 7 different fields (Title, Description, Priority, Status, Effort, Category, Date Created)
- Ascending/Descending toggle
- Smart tiebreaker logic (by creation order)
- Works seamlessly with filters

✅ **Task Numbering**
- Sequential task numbering (1, 2, 3...) independent of task IDs
- Numbering updates dynamically when filters/sorting applied
- Makes it easy to reference tasks in order

✅ **Execution Planning**
- Generates optimal task execution order based on dependencies
- Uses priority and effort for intelligent ordering
- Detects and prevents circular dependencies
- Handles complex dependency chains and diamond patterns

✅ **Comprehensive Testing**
- 55 unit tests covering all core logic
- Test coverage includes: CRUD operations, validation, dependency management, execution planning edge cases

## Technology Choices

- **Frontend**: React with Vite, responsive CSS, modern component architecture
- **Backend**: Node.js with Express, token-based authentication, in-memory storage
- **Storage**: In-memory JavaScript array (reset on server restart)
- **Algorithm**: Kahn's topological sort with custom binary heap priority queue
- **Testing**: Node.js built-in test runner (node --test)
- **Authentication**: In-memory session management with 24-hour token expiration

## Project Structure

```text
smart-task-planner/
  backend/
    controllers/
    models/
    routes/
    services/
    tests/
    utils/
    server.js
  frontend/
    src/
      components/
      constants/
      pages/
      services/
      styles/
```

## Setup

Install dependencies separately for backend and frontend.

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Run Locally

Start the backend:

```bash
cd backend
npm start
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Run Tests

```bash
cd backend
npm test
```

**Test Results**: 55/55 tests passing ✅

The test suite covers:
- **Execution Planning**: Dependency ordering, priority/effort ordering, tie-breakers, cycle detection
- **Task Services**: CRUD operations, dependency management, force delete, input validation
- **Validation**: Title, priority, status, effort, and dependency validation
- **Edge Cases**: Empty lists, large datasets, diamond patterns, long chains, circular dependencies

## Task Model

```js
{
  id,
  title,
  description,
  priority,
  estimatedEffort,
  category,
  dependencies,
  status
}
```

Priority values:

- High
- Medium
- Low

Status values:

- To Do
- In Progress
- Done

## API Endpoints

### Authentication Endpoints
```text
POST   /auth/login                 # Login with email and password
POST   /auth/logout                # Logout and invalidate token
GET    /auth/me                    # Get current user information
GET    /auth/demo-credentials      # Get available demo credentials
```

### Task Endpoints (All require authentication)
```text
GET    /tasks                      # Get all tasks
GET    /tasks/:id                  # Get single task
POST   /tasks                      # Create new task
PUT    /tasks/:id                  # Update task details
PUT    /tasks/:id/dependencies     # Update task dependencies
DELETE /tasks/:id                  # Delete task (blocks if has dependents)
DELETE /tasks/:id?force=true       # Force delete task
```

### Execution Plan Endpoint
```text
GET    /execution-plan             # Generate optimal task execution order
```

**Endpoint Details:**
- `POST /auth/login`: Returns token for authenticated requests
- `PUT /tasks/:id` updates only task details (title, description, priority, etc.)
- `PUT /tasks/:id/dependencies` updates only dependency relationships
- `DELETE /tasks/:id` rejects deletion when other tasks depend on it
- `DELETE /tasks/:id?force=true` deletes and removes from dependents' lists

For complete API documentation with examples, see **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

## Execution Planning Logic

The backend models tasks as a directed graph.

If task `T2` depends on task `T1`, then `T1` must appear before `T2` in the execution plan.

The execution plan is generated using:

1. Build graph adjacency lists from task dependencies.
2. Build indegree counts for every task.
3. Add all zero-indegree tasks into a custom binary heap priority queue.
4. Repeatedly remove the highest-ranked available task.
5. Reduce indegree for dependent tasks.
6. Add newly available tasks to the priority queue.
7. If the final plan length is smaller than the task count, a cycle exists.

When multiple tasks are available at the same time, the priority queue orders them by:

1. Higher priority first
2. Lower estimated effort first
3. Smaller task ID first

## Validation And Business Rules

- Title, priority, estimated effort, and status are required.
- Estimated effort must be a positive integer.
- A task cannot depend on itself.
- A dependency must reference an existing task.
- Duplicate dependencies are rejected.
- Cycles are allowed temporarily while editing dependencies.
- Cycles are detected only when generating the execution plan.
- Task IDs are generated by the backend as `T1`, `T2`, `T3`, and so on.
- Task IDs are never reused or renumbered after deletion.

## Frontend Workflow

The frontend separates task details from dependency management.

Users can:

- View all tasks
- Search tasks
- Create a task
- View task details
- Edit task details
- Manage dependencies from each task card
- Delete tasks
- Force delete when blocked by dependents
- Generate an execution plan
- See validation and business rule errors

Create/Edit includes only:

- Title
- Description
- Priority
- Estimated effort
- Category
- Status

Dependency management is handled through a separate modal using task titles in the UI while storing task IDs internally.

## Seed Data

The backend starts with sample in-memory tasks:

```text
T1 Setup Project
T2 Build API, depends on T1
T3 Build UI, depends on T2
```

The data resets when the backend process restarts.

## Assumptions

- In-memory data reset on restart is acceptable because the assignment forbids persistence.
- Dependencies are relationships between tasks, so they are managed separately from task details.
- Temporary circular dependencies are allowed during editing so users can continue designing the graph.
- Cycle detection belongs to execution-plan generation, where the complete graph is evaluated.

## Design Decisions And Trade-Offs

**Core Algorithm:**
- A custom binary heap priority queue is used to demonstrate data structure skills instead of relying on array sorting at every step
- Kahn's algorithm is used because it naturally supports cycle detection and dependency-first ordering

**Backend:**
- Task IDs are generated only on the backend to prevent user mistakes and keep IDs stable
- Force delete removes dependency references but does not cascade delete tasks, preventing accidental loss of work
- Dependencies are stored as task IDs internally while the frontend displays task titles for usability
- Token-based authentication chosen for stateless API design

**Frontend:**
- Sequential task numbering is independent of task IDs for better user experience
- Accordion-style filters minimize UI clutter while maintaining powerful filtering capabilities
- Temporary circular dependencies allowed during editing (detected only during plan generation)
- Dual-thumb slider used for intuitive effort range selection
- Multi-select filters use AND logic for precise data filtering

**Testing:**
- Comprehensive test suite (55 tests) covers all critical paths
- Tests use Node.js built-in test runner for zero external dependencies
- Tests verify both happy paths and edge cases

## Frontend Features

### User Interface
- Clean, modern, responsive design
- Proper spacing and typography
- Mobile-friendly layouts
- Visual feedback for all interactions
- Comprehensive error messages

### Filtering & Searching
- Text search across all task fields
- Multi-select category filter
- Multi-select priority filter
- Multi-select status filter
- Dual-thumb effort range slider
- Accordion-style filter menu
- Apply/Cancel buttons for batch filter updates
- Filter count badges
- Clear all filters button

### Sorting
- Sort by 7 fields (Title, Description, Priority, Status, Effort, Category, Date Created)
- Ascending/Descending toggle
- Smart tiebreaker by creation order
- Works with all filter combinations

### Task Management
- Sequential task numbering (updates with filters/sorts)
- Create tasks with validation
- Edit task details
- View complete task information
- Manage dependencies with circular dependency detection
- Delete tasks (with force-delete option)
- Generate execution plans
- Clear, actionable error messages

## Authentication

The application includes a **mock authentication system** suitable for demonstration and testing:

### Demo Credentials
```
Email: demo@example.com
Password: demo123

OR

Email: user@example.com
Password: password123
```

### How It Works
- Login page displayed on app startup
- Tokens stored in browser localStorage
- Token included in all API requests
- 24-hour token expiration
- Session persists across page reloads
- Logout clears session and returns to login

For more details, see **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md#authentication)**

## Bonus Features Implemented

This project goes beyond the assignment requirements with several bonus features:

✨ **Advanced Filtering System**
- Multi-field filtering (Category, Priority, Status, Effort)
- Accordion-style interface for space efficiency
- Apply/Cancel buttons for batch updates
- Active filter badges showing selection count

✨ **Comprehensive Sorting**
- 7 different sort fields available
- Ascending/Descending toggle
- Smart tiebreaker logic
- Works seamlessly with filters

✨ **Mock Authentication System**
- Secure token-based session management
- Login/logout functionality
- 24-hour token expiration
- Session persistence

✨ **Responsive UI**
- Mobile-friendly design
- Proper spacing and typography
- Accessible components
- Visual feedback for all interactions

✨ **Comprehensive Documentation**
- Complete API documentation with examples
- Request/response samples for all endpoints
- Error handling guide
- Authentication details

✨ **Extensive Testing**
- 55 unit tests (all passing)
- Edge case coverage
- Validation testing
- Execution plan logic testing

## Seed Data

The backend starts with sample in-memory tasks:

```text
T1 Setup Project (High priority, 2 effort, Setup category)
T2 Build API (High priority, 5 effort, Backend category, depends on T1)
T3 Build UI (Medium priority, 3 effort, Frontend category, depends on T2)
```

Data is reset when the backend process restarts.

## Limitations And Future Improvements

**Current Limitations:**
- Data is not persisted after server restart
- Authentication is mock-based (no real user database)
- No multi-user support or user ownership

**Potential Future Enhancements:**
- Database persistence (PostgreSQL, MongoDB, etc.)
- Real user authentication with JWT or OAuth
- User-specific task lists and sharing
- Task comments and activity history
- Recurring tasks and subtasks
- Task templates
- Export/import functionality
- Advanced scheduling and calendar view
- Real-time collaboration features
- Mobile app version
