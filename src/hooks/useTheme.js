import { useCallback, useEffect, useSyncExternalStore } from "react";

const root = () => document.documentElement;
const getTheme = () => (root().getAttribute("data-theme") === "dark" ? "dark" : "light");

// Every toggle on the page reads the <html data-theme> attribute, so they stay in sync.
const subscribe = (callback) => {
  const observer = new MutationObserver(callback);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

const readSaved = () => {
  try {
    return localStorage.getItem("theme");
  } catch (e) {
    return null;
  }
};

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");

  const toggle = useCallback(() => {
    const next = getTheme() === "dark" ? "light" : "dark";
    root().setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* storage can be unavailable; the toggle still works for this visit */
    }
  }, []);

  // Follow the system setting until the visitor picks a theme themselves.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (readSaved()) return;
      root().setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return [theme, toggle];
}
