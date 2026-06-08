import { useState, useEffect } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("gj-theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("gj-theme", theme);
    } catch {}
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};
