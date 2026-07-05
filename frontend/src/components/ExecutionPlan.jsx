function ExecutionPlan({ executionPlan, error }) {
  return (
    <section className="execution-plan">
      <div className="section-heading">
        <h2>Execution Plan</h2>
      </div>

      {error ? (
        <p className="plan-error">{error}</p>
      ) : executionPlan.length === 0 ? (
        <p className="empty-state">No execution plan generated.</p>
      ) : (
        <ol>
          {executionPlan.map((task) => (
            <li key={task.id}>
              {task.title} ({task.priority})
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default ExecutionPlan;
