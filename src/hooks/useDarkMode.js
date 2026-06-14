import { useState, useEffect } from "react";

/**
 * Subscribes to the global data-theme attribute and returns a boolean
 * indicating whether dark mode is currently active.
 *
 * Read-only — theme toggling is handled by useTheme.
 */
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
};
