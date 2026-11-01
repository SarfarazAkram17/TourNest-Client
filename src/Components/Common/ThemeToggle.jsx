import { LuMoon, LuSun } from "react-icons/lu";
import useTheme from "../../Hooks/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`btn btn-ghost btn-circle relative overflow-hidden ${className}`}
    >
      <LuSun
        size={20}
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <LuMoon
        size={20}
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
