import React from "react";
import data from "../json/data.json";
import { Arrow, ThemeToggle } from "./ui";

export const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const rise = (ms) => ({ animationDelay: `${ms}ms` });

// The name, pitch and calls to action. Sticky left column on large screens, top block on small ones.
const Intro = ({ active }) => {
  const p = data.profile;
  return (
    <header
      id="top"
      className="pt-10 sm:pt-14 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:overflow-y-auto lg:py-14"
    >
      <div>
        <p className="kicker animate-rise">
          Portfolio <span className="text-rule">/</span> {p.location}
        </p>

        <h1 className="mt-6 font-display text-[clamp(3.6rem,6.4vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.015em]">
          <span className="block animate-rise" style={rise(80)}>
            {p.firstName}
          </span>
          <span className="block animate-rise italic" style={rise(160)}>
            {p.lastName}
          </span>
        </h1>

        <div className="mt-5 flex items-center gap-4 animate-rise" style={rise(260)}>
          <span lang="ne" className="font-deva text-[1.15rem] text-accent">
            {p.nameNepali}
          </span>
          <span
            aria-hidden="true"
            className="h-px flex-1 origin-left animate-draw bg-accent/50"
            style={rise(420)}
          />
        </div>

        <p
          className="mt-7 max-w-[34ch] text-[1.2rem] leading-[1.5] text-ink-2 animate-rise"
          style={rise(340)}
        >
          <span className="font-medium text-ink">{p.role}.</span> {p.tagline}
        </p>

        <p
          className="mt-8 flex items-center gap-2.5 font-mono text-[0.78rem] text-ink-2 animate-rise"
          style={rise(420)}
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          {p.status} <span className="text-ink-3">· {p.utcOffset}</span>
        </p>

        <div
          className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 animate-rise"
          style={rise(480)}
        >
          <a
            href={`mailto:${p.email}`}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-medium text-paper transition-colors duration-200 hover:bg-accent"
          >
            Email me <Arrow />
          </a>
          <a href={p.resume} target="_blank" rel="noopener" className="group link font-medium">
            Résumé <span className="text-ink-3">(PDF)</span> <Arrow className="text-ink-3" />
          </a>
        </div>

        <nav aria-label="Sections" className="mt-14 hidden lg:block">
          <ol className="space-y-0.5">
            {SECTIONS.map((s, i) => {
              const on = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={on ? "location" : undefined}
                    className="group flex items-center gap-4 py-1.5 font-mono text-[0.78rem] uppercase tracking-[0.14em]"
                  >
                    <span className={on ? "text-accent" : "text-ink-3"}>0{i + 1}</span>
                    <span
                      aria-hidden="true"
                      className={`h-px transition-all duration-300 ${
                        on ? "w-16 bg-ink" : "w-8 bg-rule group-hover:w-16 group-hover:bg-ink-2"
                      }`}
                    />
                    <span className={on ? "text-ink" : "text-ink-3 group-hover:text-ink"}>
                      {s.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="mt-10 hidden items-center justify-between lg:flex">
        <ul className="flex gap-5 font-mono text-[0.78rem]">
          {p.socials.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="group link text-ink-2">
                {s.label} <Arrow />
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle showLabel />
      </div>
    </header>
  );
};

export const MobileBar = () => (
  <div className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md lg:hidden">
    <nav
      aria-label="Sections"
      className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-3 px-5 sm:px-8"
    >
      <a href="#top" className="hidden font-display text-[1.35rem] leading-none sm:block">
        B<span className="text-accent">.</span>B
      </a>
      <ul className="flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-2 sm:gap-6">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="py-3 hover:text-ink">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <ThemeToggle />
    </nav>
  </div>
);

export default Intro;
