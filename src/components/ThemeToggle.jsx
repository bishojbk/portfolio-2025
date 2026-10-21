import React from "react";
import useTheme from "../hooks/useTheme";

const ThemeToggle = () => {
  const [theme, toggle] = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-line px-2.5 py-1 text-[0.9rem] font-semibold hover:border-fg"
    >
      {next === "dark" ? "Dark" : "Light"} mode
    </button>
  );
};

export default ThemeToggle;
