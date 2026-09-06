import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <span className="theme-toggle-icon">
        {theme === "light" ? "🌙" : "☀️"}
      </span>

      <span>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
}