"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-[10px] transition-colors ${
        theme === "dark"
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-[#011F72] text-white hover:bg-blue-400"
      }`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark/light mode"
      type="button"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      <span className="ml-2">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;
