import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import SortPanel from "../components/SortPanel";
import TaskList from "../components/TaskList";
import ExecutionPlan from "../components/ExecutionPlan";
import LoginModal from "../components/LoginModal";
import "../styles/HomePage.css";
import TaskForm from "../components/TaskForm";
import TaskDetails from "../components/TaskDetails";
import {
  getAllTasks,
  deleteTask,
  getExecutionPlan,
  updateTaskDependencies,
} from "../services/taskService";
import DependencyModal from "../components/DependencyModal";

const DEPENDENT_DELETE_MESSAGE =
  "Cannot delete task because other tasks depend on it.";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [executionPlan, setExecutionPlan] = useState([]);
  const [planError, setPlanError] = useState("");
  const [viewTask, setViewTask] = useState(null);
  const [formTask, setFormTask] = useState(null);
  const [dependencyTask, setDependencyTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    priorities: [],
    statuses: [],
    effortRange: [0, 10],
  });
  const [sortConfig, setSortConfig] = useState({
    field: "createdAt",
    direction: "asc",
  });

  const priorityOrder = { Low: 0, Medium: 1, High: 2 };
  const statusOrder = { Pending: 0, "In Progress": 1, Completed: 2 };

  const getSortValue = (task, field) => {
    switch (field) {
      case "title":
        return task.title.toLowerCase();
      case "description":
        return task.description.toLowerCase();
      case "effort":
        return task.estimatedEffort;
      case "priority":
        return priorityOrder[task.priority] || -1;
      case "status":
        return statusOrder[task.status] || -1;
      case "category":
        return task.category.toLowerCase();
      case "createdAt":
        return task.id;
      default:
        return "";
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();

      // Text search filter
      if (normalizedSearch) {
        const searchableText = [
          task.title,
          task.description,
          task.priority,
          task.category,
          task.status,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedSearch)) return false;
      }

      // Category filter
      if (
        selectedFilters.categories.length > 0 &&
        !selectedFilters.categories.includes(task.category)
      ) {
        return false;
      }

      // Priority filter
      if (
        selectedFilters.priorities.length > 0 &&
        !selectedFilters.priorities.includes(task.priority)
      ) {
        return false;
      }

      // Status filter
      if (
        selectedFilters.statuses.length > 0 &&
        !selectedFilters.statuses.includes(task.status)
      ) {
        return false;
      }

      // Effort range filter
      if (
        task.estimatedEffort < selectedFilters.effortRange[0] ||
        task.estimatedEffort > selectedFilters.effortRange[1]
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.field);
      const bValue = getSortValue(b, sortConfig.field);

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }

      if (comparison === 0) {
        // Tiebreaker: sort by ID (creation order)
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");

    if (token && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadTasks() {
      const data = await getAllTasks();

      setTasks(data);

      // Initialize effort range based on actual data
      const efforts = data
        .map((t) => t.estimatedEffort)
        .filter((e) => e !== undefined && e !== null);
      if (efforts.length > 0) {
        const minEffort = Math.min(...efforts);
        const maxEffort = Math.max(...efforts);
        setSelectedFilters((prev) => ({
          ...prev,
          effortRange: [minEffort, maxEffort],
        }));
      }
    }

    loadTasks();
  }, [isAuthenticated]);

  async function handleDelete(taskId) {
    try {
      await deleteTask(taskId);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      if (error.message === DEPENDENT_DELETE_MESSAGE) {
        const shouldForceDelete = window.confirm(
          `${error.message}\n\nChoose OK to Force Delete, or Cancel to keep the task.`,
        );

        if (!shouldForceDelete) return;

        await deleteTask(taskId, true);
        setTasks((prevTasks) =>
          prevTasks
            .filter((task) => task.id !== taskId)
            .map((task) => ({
              ...task,
              dependencies: task.dependencies.filter(
                (dependency) => dependency !== taskId,
              ),
            })),
        );
        setExecutionPlan([]);
        setPlanError("");
        return;
      }

      alert(error.message);
    }
  }

  async function handleGeneratePlan() {
    try {
      const plan = await getExecutionPlan();

      setExecutionPlan(plan);
      setPlanError("");
    } catch (error) {
      setExecutionPlan([]);
      setPlanError(error.message);
    }
  }

  async function handleSaveDependencies(dependencies) {
    const response = await updateTaskDependencies(
      dependencyTask.id,
      dependencies,
    );

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === dependencyTask.id ? response.task : task,
      ),
    );
    setDependencyTask(null);
    setExecutionPlan([]);
    setPlanError("");
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserEmail(null);
    setTasks([]);
  };

  if (!isAuthenticated) {
    return (
      <LoginModal
        onLoginSuccess={(email) => {
          setUserEmail(email);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="home-container">
      <header className="app-header">
        <div>
          <h1>Smart Task Planner</h1>
          <p>Plan sprint tasks, manage dependencies, and generate execution order.</p>
          <p className="user-info">👤 Logged in as: {userEmail}</p>
        </div>
        <div className="header-buttons">
          <button
            className="primary-button"
            onClick={() => {
              setIsEditing(false);
              setFormTask(null);
              setShowForm(true);
            }}
          >
            Create Task
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      {viewTask && (
        <TaskDetails
          task={viewTask}
          allTasks={tasks}
          onClose={() => setViewTask(null)}
        />
      )}
      {showForm && (
        <TaskForm
          onClose={() => setShowForm(false)}
          setTasks={setTasks}
          selectedTask={formTask}
          isEditing={isEditing}
        />
      )}
      {dependencyTask && (
        <DependencyModal
          task={dependencyTask}
          allTasks={tasks}
          onClose={() => setDependencyTask(null)}
          onSave={handleSaveDependencies}
        />
      )}
      <div className="toolbar">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>
      <FilterPanel
        tasks={tasks}
        selectedFilters={selectedFilters}
        onFilterChange={setSelectedFilters}
      />
      <SortPanel sortConfig={sortConfig} onSortChange={setSortConfig} />
      <TaskList
        tasks={filteredTasks}
        onView={(task) => {
          setViewTask(task);
        }}
        onDelete={handleDelete}
        onEdit={(task) => {
          setFormTask(task);
          setIsEditing(true);
          setShowForm(true);
        }}
        onManageDependencies={(task) => setDependencyTask(task)}
      />

      <button className="primary-button" onClick={handleGeneratePlan}>
        Generate Execution Plan
      </button>

      <ExecutionPlan executionPlan={executionPlan} error={planError} />
    </div>
  );
}

export default HomePage;
