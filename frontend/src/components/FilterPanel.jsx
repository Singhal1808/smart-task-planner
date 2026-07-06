import { useState } from "react";
import "../styles/FilterPanel.css";

function FilterPanel({
  tasks,
  onFilterChange,
  selectedFilters,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];
  const priorities = [...new Set(tasks.map((t) => t.priority).filter(Boolean))];
  const statuses = [...new Set(tasks.map((t) => t.status).filter(Boolean))];
  const efforts = tasks
    .map((t) => t.estimatedEffort)
    .filter((e) => e !== undefined && e !== null);
  const maxEffort = efforts.length > 0 ? Math.max(...efforts) : 10;
  const minEffort = efforts.length > 0 ? Math.min(...efforts) : 0;

  const handleCategoryChange = (category) => {
    const updated = selectedFilters.categories.includes(category)
      ? selectedFilters.categories.filter((c) => c !== category)
      : [...selectedFilters.categories, category];

    onFilterChange({ ...selectedFilters, categories: updated });
  };

  const handlePriorityChange = (priority) => {
    const updated = selectedFilters.priorities.includes(priority)
      ? selectedFilters.priorities.filter((p) => p !== priority)
      : [...selectedFilters.priorities, priority];

    onFilterChange({ ...selectedFilters, priorities: updated });
  };

  const handleStatusChange = (status) => {
    const updated = selectedFilters.statuses.includes(status)
      ? selectedFilters.statuses.filter((s) => s !== status)
      : [...selectedFilters.statuses, status];

    onFilterChange({ ...selectedFilters, statuses: updated });
  };

  const handleEffortChange = (e) => {
    const value = Number(e.target.value);
    const newRange = [selectedFilters.effortRange[0], value];

    onFilterChange({ ...selectedFilters, effortRange: newRange });
  };

  const handleEffortMinChange = (e) => {
    const value = Number(e.target.value);
    const newRange = [value, selectedFilters.effortRange[1]];

    onFilterChange({ ...selectedFilters, effortRange: newRange });
  };

  const activeFilterCount =
    selectedFilters.categories.length +
    selectedFilters.priorities.length +
    selectedFilters.statuses.length;

  return (
    <div className="filter-panel-wrapper">
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        🔽 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {showFilters && (
        <div className="filter-panel">
          {/* Category Filter */}
          <div className="filter-section">
            <h4>Category</h4>
            <div className="filter-options">
              {categories.length === 0 ? (
                <p className="no-options">No categories available</p>
              ) : (
                categories.map((cat) => (
                  <label key={cat} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedFilters.categories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <span>{cat}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="filter-section">
            <h4>Priority</h4>
            <div className="filter-options">
              {priorities.length === 0 ? (
                <p className="no-options">No priorities available</p>
              ) : (
                priorities.map((pri) => (
                  <label key={pri} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedFilters.priorities.includes(pri)}
                      onChange={() => handlePriorityChange(pri)}
                    />
                    <span>{pri}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-section">
            <h4>Status</h4>
            <div className="filter-options">
              {statuses.length === 0 ? (
                <p className="no-options">No statuses available</p>
              ) : (
                statuses.map((stat) => (
                  <label key={stat} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedFilters.statuses.includes(stat)}
                      onChange={() => handleStatusChange(stat)}
                    />
                    <span>{stat}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Effort Range Filter */}
          <div className="filter-section">
            <h4>Effort Range</h4>
            <div className="effort-range">
              <div className="range-inputs">
                <input
                  type="number"
                  min={minEffort}
                  max={maxEffort}
                  value={selectedFilters.effortRange[0]}
                  onChange={handleEffortMinChange}
                  className="range-input"
                />
                <span>to</span>
                <input
                  type="number"
                  min={minEffort}
                  max={maxEffort}
                  value={selectedFilters.effortRange[1]}
                  onChange={handleEffortChange}
                  className="range-input"
                />
              </div>
              <input
                type="range"
                min={minEffort}
                max={maxEffort}
                value={selectedFilters.effortRange[1]}
                onChange={handleEffortChange}
                className="effort-slider"
              />
              <div className="range-labels">
                <span>{minEffort}</span>
                <span>{maxEffort}</span>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              className="clear-filters-btn"
              onClick={() =>
                onFilterChange({
                  categories: [],
                  priorities: [],
                  statuses: [],
                  effortRange: [minEffort, maxEffort],
                })
              }
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
