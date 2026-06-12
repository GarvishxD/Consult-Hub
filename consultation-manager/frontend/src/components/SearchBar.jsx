export default function SearchBar({ value, onChange, placeholder, onClear }) {
  return (
    <div className="search-bar">
      <span className="search-icon">⌕</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button type="button" className="search-clear" onClick={onClear}>
          ✕
        </button>
      )}
    </div>
  );
}
