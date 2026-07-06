import { useState } from "react";
import "../styles/FilterPanel.css";

function FilterPanel({
  tasks,
  onFilterChange,
  selectedFilters,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [tempFilters, setTempFilters] = useState(selectedFilters);

  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];
  const priorities = [...new Set(tasks.map((t) => t.priority).filter(Boolean))];
  const statuses = [...new Set(tasks.map((t) => t.status).filter(Boolean))];
  const efforts = tasks
    .map((t) => t.estimatedEffort)
    .filter((e) => e !== undefined && e !== null);
  const maxEffort = efforts.length > 0 ? Math.max(...efforts) : 10;
  const minEffort = efforts.length > 0 ? Math.min(...efforts) : 0;

  const handleCategoryChange = (category) => {
    const updated = tempFilters.categories.includes(category)
      ? tempFilters.categories.filter((c) => c !== category)
      : [...tempFilters.categories, category];

    setTempFilters({ ...tempFilters, categories: updated });
  };

  const handlePriorityChange = (priority) => {
    const updated = tempFilters.priorities.includes(priority)
      ? tempFilters.priorities.filter((p) => p !== priority)
      : [...tempFilters.priorities, priority];

    setTempFilters({ ...tempFilters, priorities: updated });
  };

  const handleStatusChange = (status) => {
    const updated = tempFilters.statuses.includes(status)
      ? tempFilters.statuses.filter((s) => s !== status)
      : [...tempFilters.statuses, status];

    setTempFilters({ ...tempFilters, statuses: updated });
  };

  const handleEffortMaxChange = (e) => {
    const value = Number(e.target.value);
    const newRange = [tempFilters.effortRange[0], value];

    setTempFilters({ ...tempFilters, effortRange: newRange });
  };

  const handleEffortMinChange = (e) => {
    const value = Number(e.target.value);
    const newRange = [value, tempFilters.effortRange[1]];

    setTempFilters({ ...tempFilters, effortRange: newRange });
  };

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setShowFilters(false);
  };

  const handleCancel = () => {
    setTempFilters(selectedFilters);
    setShowFilters(false);
    setExpandedFilter(null);
  };

  const handleRemoveAllFilters = () => {
    const clearedFilters = {
      categories: [],
      priorities: [],
      statuses: [],
      effortRange: [minEffort, maxEffort],
    };
    setTempFilters(clearedFilters);
  };

  const activeFilterCount =
    selectedFilters.categories.length +
    selectedFilters.priorities.length +
    selectedFilters.statuses.length;

  return (
    <div className="filter-panel-wrapper">
      <button
        className="filter-toggle-btn"
        onClick={() => {
          setShowFilters(!showFilters);
          setTempFilters(selectedFilters);
          if (showFilters) {
            setExpandedFilter(null);
          }
        }}
      >
        🔽 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-menu">
            {/* Filter Menu Items */}
            <button
              className={`filter-menu-item ${
                expandedFilter === "category" ? "active" : ""
              }`}
              onClick={() =>
                setExpandedFilter(
                  expandedFilter === "category" ? null : "category"
                )
              }
            >
              <span>Category</span>
              {tempFilters.categories.length > 0 && (
                <span className="filter-badge">{tempFilters.categories.length}</span>
              )}
            </button>

            <button
              className={`filter-menu-item ${
                expandedFilter === "priority" ? "active" : ""
              }`}
              onClick={() =>
                setExpandedFilter(
                  expandedFilter === "priority" ? null : "priority"
                )
              }
            >
              <span>Priority</span>
              {tempFilters.priorities.length > 0 && (
                <span className="filter-badge">{tempFilters.priorities.length}</span>
              )}
            </button>

            <button
              className={`filter-menu-item ${
                expandedFilter === "status" ? "active" : ""
              }`}
              onClick={() =>
                setExpandedFilter(expandedFilter === "status" ? null : "status")
              }
            >
              <span>Status</span>
              {tempFilters.statuses.length > 0 && (
                <span className="filter-badge">{tempFilters.statuses.length}</span>
              )}
            </button>

            <button
              className={`filter-menu-item ${
                expandedFilter === "effort" ? "active" : ""
              }`}
              onClick={() =>
                setExpandedFilter(expandedFilter === "effort" ? null : "effort")
              }
            >
              <span>Effort</span>
              {(tempFilters.effortRange[0] !== minEffort ||
                tempFilters.effortRange[1] !== maxEffort) && (
                <span className="filter-badge">✓</span>
              )}
            </button>
          </div>

          {/* Filter Content - Show only expanded filter */}
          <div className="filter-content">
            {expandedFilter === "category" && (
              <div className="filter-section">
                <h5>Select Categories</h5>
                <div className="filter-options">
                  {categories.length === 0 ? (
                    <p className="no-options">No categories available</p>
                  ) : (
                    categories.map((cat) => (
                      <label key={cat} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={tempFilters.categories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                        />
                        <span>{cat}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {expandedFilter === "priority" && (
              <div className="filter-section">
                <h5>Select Priorities</h5>
                <div className="filter-options">
                  {priorities.length === 0 ? (
                    <p className="no-options">No priorities available</p>
                  ) : (
                    priorities.map((pri) => (
                      <label key={pri} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={tempFilters.priorities.includes(pri)}
                          onChange={() => handlePriorityChange(pri)}
                        />
                        <span>{pri}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {expandedFilter === "status" && (
              <div className="filter-section">
                <h5>Select Statuses</h5>
                <div className="filter-options">
                  {statuses.length === 0 ? (
                    <p className="no-options">No statuses available</p>
                  ) : (
                    statuses.map((stat) => (
                      <label key={stat} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={tempFilters.statuses.includes(stat)}
                          onChange={() => handleStatusChange(stat)}
                        />
                        <span>{stat}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {expandedFilter === "effort" && (
              <div className="filter-section">
                <h5>Select Effort Range</h5>
                <div className="effort-range">
                  <div className="range-inputs">
                    <input
                      type="number"
                      min={minEffort}
                      max={maxEffort}
                      value={tempFilters.effortRange[0]}
                      onChange={handleEffortMinChange}
                      className="range-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min={minEffort}
                      max={maxEffort}
                      value={tempFilters.effortRange[1]}
                      onChange={handleEffortMaxChange}
                      className="range-input"
                    />
                  </div>
                  <input
                    type="range"
                    min={minEffort}
                    max={maxEffort}
                    value={tempFilters.effortRange[1]}
                    onChange={handleEffortMaxChange}
                    className="effort-slider"
                  />
                  <div className="range-labels">
                    <span>{minEffort}</span>
                    <span>{maxEffort}</span>
                  </div>
                </div>
              </div>
            )}

            {!expandedFilter && (
              <div className="filter-section empty-state">
                <p>👆 Select a filter to begin</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="filter-actions">
            {activeFilterCount > 0 && (
              <button
                className="remove-all-btn"
                onClick={handleRemoveAllFilters}
              >
                🗑️ Remove All
              </button>
            )}
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="apply-btn" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
