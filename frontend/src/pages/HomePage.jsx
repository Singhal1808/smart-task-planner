import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import TaskList from "../components/TaskList";
import ExecutionPlan from "../components/ExecutionPlan";
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
  const [tasks, setTasks] = useState([]);
  const [executionPlan, setExecutionPlan] = useState([]);
  const [planError, setPlanError] = useState("");
  const [viewTask, setViewTask] = useState(null);
  const [formTask, setFormTask] = useState(null);
  const [dependencyTask, setDependencyTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return true;

    return [
      task.title,
      task.description,
      task.priority,
      task.category,
      task.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  useEffect(() => {
    async function loadTasks() {
      const data = await getAllTasks();

      setTasks(data);
    }

    loadTasks();
  }, []);

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

  return (
    <div className="home-container">
      <header className="app-header">
        <div>
          <h1>Smart Task Planner</h1>
          <p>Plan sprint tasks, manage dependencies, and generate execution order.</p>
        </div>
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
