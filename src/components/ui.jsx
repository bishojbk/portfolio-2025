import React, { Fragment } from "react";
import useTheme from "../hooks/useTheme";

export const Arrow = ({ className = "" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className={`inline-block h-[0.8em] w-[0.8em] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d="M4.5 11.5l7-7M6 4.5h5.5V10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Renders **bold** segments inside a plain string.
export const Rich = ({ text }) => (
  <>
    {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") ? (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      )
    )}
  </>
);

export const Dash = () => (
  <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-accent" />
);

export const Tags = ({ items, label = "Tech stack" }) => (
  <ul aria-label={label} className="flex flex-wrap gap-2">
    {items.map((item) => (
      <li key={item} className="tag">
        {item}
      </li>
    ))}
  </ul>
);

export const SectionHeading = ({ n, title, aside, id }) => (
  <div className="flex items-baseline gap-4 border-t-2 border-ink pt-4">
    <span className="font-mono text-[0.8rem] text-accent">{n}</span>
    <h2 id={id} className="font-display text-[clamp(2.25rem,4vw,2.9rem)] leading-none">
      {title}
    </h2>
    {aside && <span className="kicker ml-auto hidden sm:block">{aside}</span>}
  </div>
);

export const ThemeToggle = ({ showLabel = false }) => {
  const [theme, toggle] = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        showLabel
          ? `${theme === "dark" ? "Dark" : "Light"} theme, switch to ${next}`
          : `Switch to ${next} theme`
      }
      title={`Switch to ${next} theme`}
      className="group inline-flex h-9 items-center gap-2 rounded-full border border-rule px-2.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-ink hover:text-ink"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
        <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 3a7 7 0 0 1 0 14z" fill="currentColor" />
      </svg>
      {showLabel && <span>{theme === "dark" ? "Dark" : "Light"}</span>}
    </button>
  );
};
