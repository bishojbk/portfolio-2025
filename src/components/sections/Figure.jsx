import React from "react";

const PLATES = {
  tree: [
    { t: "agencyheight/", tone: "ink" },
    { t: "├── apps/web            Next.js" },
    { t: "├── packages/ui         design system" },
    { t: "├── packages/auth" },
    { t: "├── packages/api" },
    { t: "├── packages/state" },
    { t: "└── packages/analytics" },
  ],
  scan: [
    { t: "$ a11y-beast scan https://example.com", tone: "ink" },
    { t: "✓ 1.4.3  Contrast (Minimum)" },
    { t: "✗ 1.1.1  Non-text Content · 3 issues", tone: "accent" },
    { t: "✓ 2.4.7  Focus Visible" },
    { t: "✗ 4.1.2  Name, Role, Value · 1 issue", tone: "accent" },
  ],
  rules: [
    { t: "# CLAUDE.md  (generated)", tone: "ink" },
    { t: "- Read only the files a task names" },
    { t: "- Prefer targeted greps over full reads" },
    { t: "- Batch related edits into one pass" },
  ],
};

const toneClass = { ink: "text-ink", accent: "text-accent" };

const Plate = ({ figure }) => (
  <div
    className="flex h-full flex-col justify-between gap-6 p-6 sm:p-8"
    style={{
      backgroundImage:
        "repeating-linear-gradient(to bottom, transparent 0 27px, rgb(var(--rule) / 0.55) 27px 28px)",
    }}
  >
    <p className="flex items-baseline gap-3">
      <span className="font-display text-[clamp(3rem,8vw,5.25rem)] leading-none tracking-[-0.02em]">
        {figure.metric}
      </span>
      <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-3">
        {figure.metricLabel}
      </span>
    </p>
    <pre className="overflow-x-auto font-mono text-[0.7rem] leading-[1.75] text-ink-2 sm:text-[0.8rem]">
      {PLATES[figure.variant].map((line, i) => (
        <span key={i} className={`block ${toneClass[line.tone] || ""}`}>
          {line.t}
        </span>
      ))}
    </pre>
  </div>
);

const Figure = ({ figure, n }) => (
  <figure>
    <div className="relative overflow-hidden rounded-[3px] border border-rule bg-paper-2 sm:aspect-[16/10]">
      {figure.type === "image" ? (
        <img
          src={figure.src}
          srcSet={`${figure.src.replace(".webp", "-640.webp")} 640w, ${figure.src} 1280w`}
          sizes="(min-width: 1280px) 650px, (min-width: 1024px) 52vw, 92vw"
          width={figure.width}
          height={figure.height}
          alt={figure.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      ) : (
        <Plate figure={figure} />
      )}
    </div>
    <figcaption className="mt-2.5 font-mono text-[0.72rem] text-ink-3">
      <span className="text-ink-2">Fig. {n}</span> — {figure.caption}
    </figcaption>
  </figure>
);

export default Figure;
