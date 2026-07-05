import { useState } from "react";
import "../styles/Modal.css";

function DependencyModal({ task, allTasks, onClose, onSave }) {
  const [error, setError] = useState("");
  const [selectedDependencies, setSelectedDependencies] = useState(
    task.dependencies || [],
  );
  const availableDependencyTasks = allTasks.filter((item) => item.id !== task.id);

  function handleCheckboxChange(taskId) {
    if (selectedDependencies.includes(taskId)) {
      setSelectedDependencies(selectedDependencies.filter((id) => id !== taskId));
    } else {
      setSelectedDependencies([...selectedDependencies, taskId]);
    }
  }

  async function handleSave() {
    setError("");

    try {
      await onSave(selectedDependencies);
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Manage Dependencies</h2>

        <h3>{task.title}</h3>
        <p>Depends On</p>
        {error && <p className="form-error">{error}</p>}

        {availableDependencyTasks.length === 0 ? (
          <p>No other tasks available.</p>
        ) : (
          availableDependencyTasks.map((dependencyTask) => (
            <div key={dependencyTask.id} className="dependency-item">
              <label className="dependency-label">
                <input
                  type="checkbox"
                  checked={selectedDependencies.includes(dependencyTask.id)}
                  onChange={() => handleCheckboxChange(dependencyTask.id)}
                />
                <span>{dependencyTask.title}</span>
              </label>
            </div>
          ))
        )}

        <div className="task-form-buttons">
          <button onClick={handleSave}>Save</button>

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DependencyModal;
