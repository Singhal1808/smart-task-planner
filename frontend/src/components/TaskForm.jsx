import "../styles/Modal.css";
import { useState } from "react";
import { createTask, updateTask } from "../services/taskService";
import { PRIORITIES, STATUS } from "../constants/taskConstants";

function TaskForm({ onClose, setTasks, selectedTask, isEditing }) {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(
    selectedTask
      ? {
          ...selectedTask,
        }
      : {
          title: "",
          description: "",
          priority: "Medium",
          estimatedEffort: "",
          category: "",
          status: "To Do",
        },
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const taskDetails = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      estimatedEffort: Number(formData.estimatedEffort),
      category: formData.category,
      status: formData.status,
    };

    try {
      if (isEditing) {
        const response = await updateTask(selectedTask.id, taskDetails);

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTask.id ? response.task : task,
          ),
        );
      } else {
        const response = await createTask(taskDetails);

        setTasks((prevTasks) => [...prevTasks, response.task]);
      }
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <h2>{isEditing ? "Edit Task" : "Create Task"}</h2>
          {error && <p className="form-error">{error}</p>}
          <label className="form-field">
            <span>Title</span>
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Add optional details"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <label className="form-field">
            <span>Priority</span>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Estimated Effort</span>
            <input
              type="number"
              name="estimatedEffort"
              placeholder="Enter a positive integer"
              value={formData.estimatedEffort}
              onChange={handleChange}
              min="1"
              step="1"
              required
            />
          </label>

          <label className="form-field">
            <span>Category</span>
            <input
              type="text"
              name="category"
              placeholder="Optional category"
              value={formData.category}
              onChange={handleChange}
            />
          </label>

          <label className="form-field">
            <span>Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <div className="task-form-buttons">
            <button type="submit">{isEditing ? "Update" : "Create"}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
