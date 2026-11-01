import { LuSearch } from "react-icons/lu";

const SearchInput = ({ value, onChange, placeholder = "Search", label, className = "" }) => (
  <label className={`input w-full items-center gap-2 ${className}`}>
    <LuSearch className="shrink-0 opacity-60" size={18} aria-hidden="true" />
    <input
      type="search"
      className="min-w-0 grow"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label || placeholder}
    />
  </label>
);

export default SearchInput;
