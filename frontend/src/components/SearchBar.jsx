function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <input
      className="search-input"
      type="text"
      placeholder="Search Tasks..."
      value={searchTerm}
      onChange={(event) => onSearchChange(event.target.value)}
    />
  );
}

export default SearchBar;
