import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={20} className="animate-fade-in" />
      ) : (
        <Sun size={20} className="animate-fade-in" />
      )}
    </button>
  );
};

export default ThemeToggle;
