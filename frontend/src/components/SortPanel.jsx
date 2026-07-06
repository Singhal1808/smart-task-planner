import "../styles/SortPanel.css";

function SortPanel({ sortConfig, onSortChange }) {
  const sortFields = [
    { value: "title", label: "Title (A-Z)" },
    { value: "description", label: "Description" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
    { value: "effort", label: "Effort" },
    { value: "category", label: "Category" },
    { value: "createdAt", label: "Date Created" },
  ];

  const handleFieldChange = (field) => {
    onSortChange({ ...sortConfig, field });
  };

  const handleDirectionChange = () => {
    onSortChange({
      ...sortConfig,
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const currentFieldLabel = sortFields.find(
    (f) => f.value === sortConfig.field
  )?.label;

  return (
    <div className="sort-panel-wrapper">
      <div className="sort-control">
        <label className="sort-label">Sort By:</label>
        <select
          className="sort-select"
          value={sortConfig.field}
          onChange={(e) => handleFieldChange(e.target.value)}
        >
          {sortFields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>

        <button
          className={`sort-direction-btn ${sortConfig.direction}`}
          onClick={handleDirectionChange}
          title={
            sortConfig.direction === "asc"
              ? "Ascending (Click to reverse)"
              : "Descending (Click to reverse)"
          }
        >
          {sortConfig.direction === "asc" ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );
}

export default SortPanel;
