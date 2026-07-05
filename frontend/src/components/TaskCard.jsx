import "../styles/TaskCard.css";

function TaskCard({ task, onView, onDelete, onEdit, onManageDependencies }) {
  return (
    <div className="task-card">
      <div className="task-info">
        <h3>{task.title}</h3>

        <div className="task-meta">
          <span className={`task-badge priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <span>{task.estimatedEffort} effort</span>
          <span>{task.status}</span>
        </div>

        <p className="task-category">
          {task.category || "Uncategorized"}
        </p>
      </div>

      <div className="task-actions">
        <button onClick={() => onView(task)}>View</button>
        <button onClick={() => onEdit(task)}>Edit Details</button>
        <button onClick={() => onManageDependencies(task)}>Dependencies</button>
        <button className="danger-button" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
