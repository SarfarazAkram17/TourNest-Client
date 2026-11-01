import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const STORAGE_KEY = "tournest-theme";
const META_COLORS = { light: "#ffffff", dark: "#0a1012" };

const getSystemTheme = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const getStoredTheme = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", META_COLORS[theme]);
};

/**
 * Single source of truth for the colour theme.
 * - First visit follows the operating-system preference.
 * - Once the visitor toggles, their choice is stored and always wins.
 */
const ThemeProvider = ({ children }) => {
  const [stored, setStored] = useState(getStoredTheme);
  const [system, setSystem] = useState(getSystemTheme);
  const theme = stored ?? system;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => setSystem(event.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next) => {
    setStored(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode) - theme still applies for the session */
    }
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme]
  );

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
};

export default ThemeProvider;
