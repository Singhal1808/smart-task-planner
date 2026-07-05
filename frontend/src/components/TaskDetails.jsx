import "../styles/Modal.css";

function TaskDetails({ task, allTasks, onClose }) {
  if (!task) return null;

  const dependencyTitles = task.dependencies
    .map((dependencyId) => {
      const dependency = allTasks.find((item) => item.id === dependencyId);
      return dependency?.title || dependencyId;
    })
    .join(", ");
  const details = [
    ["Title", task.title],
    ["Description", task.description || "Not provided"],
    ["Priority", task.priority],
    ["Effort", task.estimatedEffort],
    ["Category", task.category || "Uncategorized"],
    ["Status", task.status],
    ["Dependencies", dependencyTitles.length === 0 ? "None" : dependencyTitles],
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Task Details</h2>

        <dl className="detail-list">
          {details.map(([label, value]) => (
            <div className="detail-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="task-form-buttons">
          <button className="primary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
