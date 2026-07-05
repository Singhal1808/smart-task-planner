import TaskCard from "./TaskCard";
import "../styles/TaskList.css";

function TaskList({ tasks, onView, onDelete, onEdit, onManageDependencies }) {
  return (
    <div className="task-list">
      <div className="section-heading">
        <h2>Tasks</h2>
        <span>{tasks.length} shown</span>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-state">No tasks match your search.</p>
      ) : (
        tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onView={onView}
          onDelete={onDelete}
          onEdit={onEdit}
          onManageDependencies={onManageDependencies}
        />
        ))
      )}
    </div>
  );
}

export default TaskList;
