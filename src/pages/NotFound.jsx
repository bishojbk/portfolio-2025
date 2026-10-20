import React from "react";
import { Arrow, ThemeToggle } from "../components/ui";

const NotFound = () => (
  <main className="mx-auto flex min-h-screen max-w-[1280px] flex-col justify-between px-5 py-10 sm:px-8 lg:px-12">
    <div className="flex items-center justify-between">
      <a href="/" className="font-display text-[1.6rem] leading-none">
        B<span className="text-accent">.</span>B
      </a>
      <ThemeToggle showLabel />
    </div>
    <div>
      <p className="kicker">Error 404</p>
      <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3.5rem,9vw,7rem)] leading-[0.9]">
        This page isn't <em className="text-accent">here.</em>
      </h1>
      <p className="mt-8">
        <a href="/" className="group link font-mono text-[0.8rem] uppercase tracking-[0.12em]">
          Back to the portfolio <Arrow />
        </a>
      </p>
    </div>
    <p className="font-mono text-[0.72rem] text-ink-3">Bisoj Biswakarma · Kathmandu</p>
  </main>
);

export default NotFound;
