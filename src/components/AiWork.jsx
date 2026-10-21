import React from "react";

// Small drawn diagrams, not screenshots: they show the shape of each habit.
// All are decorative; the text next to them says the same thing.

const Window = ({ title, children, dark }) => (
  <div
    aria-hidden="true"
    className={`h-full overflow-hidden rounded-2xl border ${dark ? "border-white/10 bg-term" : "border-line bg-bg"} font-mono text-[0.75rem] leading-[1.7]`}
  >
    <div className={`flex items-center gap-1.5 border-b px-3 py-1.5 ${dark ? "border-white/10 text-[#BDC1C6]" : "border-line text-muted"}`}>
      <span className="truncate font-sans text-[0.72rem] font-semibold">{title}</span>
    </div>
    <div className="px-3 py-2.5">{children}</div>
  </div>
);

const Bar = ({ w, className = "" }) => <span className={`block h-2 rounded-full ${className}`} style={{ width: w }} />;

const DailyVisual = () => (
  <Window title="claude" dark>
    <span className="block text-[#E8EAED]">
      <span className="text-[#81C995]">❯</span> claude
    </span>
    <span className="mt-1.5 block text-[#8AB4F8]">● Plan</span>
    <span className="block pl-3 text-[#BDC1C6]">☑ read the code</span>
    <span className="block pl-3 text-[#BDC1C6]">☑ change + tests</span>
    <span className="block pl-3 text-[#BDC1C6]">☐ checks, open PR</span>
    <span className="mt-1.5 block">
      <span className="text-[#81C995]">+ 42</span> <span className="text-[#F28B82]">− 17</span>{" "}
      <span className="text-[#BDC1C6]">for review</span>
    </span>
  </Window>
);

const Lane = ({ name, w }) => (
  <div className="flex items-center gap-2">
    <span className="w-16 shrink-0 font-sans text-[0.72rem] font-semibold text-muted">{name}</span>
    <span className="relative h-2 flex-1 rounded-full bg-line">
      <span className="absolute inset-y-0 left-0 rounded-full bg-link" style={{ width: w }} />
    </span>
  </div>
);

const ParallelVisual = () => (
  <div aria-hidden="true" className="flex h-full flex-col justify-center rounded-2xl border border-line bg-bg p-4">
    <div className="space-y-2.5">
      <Lane name="agent 1" w="92%" />
      <Lane name="agent 2" w="70%" />
      <Lane name="agent 3" w="84%" />
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-1.5 whitespace-nowrap text-[0.7rem] font-semibold">
      <span className="rounded-md border border-line bg-panel px-1.5 py-0.5">worktrees</span>
      <span className="text-muted">→</span>
      <span className="rounded-md border border-line bg-panel px-1.5 py-0.5">DevTools</span>
      <span className="text-muted">→</span>
      <span className="rounded-md bg-link px-1.5 py-0.5 text-bg">review</span>
    </div>
  </div>
);

const RulesVisual = () => (
  <Window title="my-repo">
    <span className="block text-fg">
      <span className="text-link">▸</span> CLAUDE.md
    </span>
    <span className="block text-fg">
      <span className="text-link">▾</span> .claude/
    </span>
    <span className="block pl-4 text-muted">▸ skills/</span>
    <span className="block pl-4 text-muted">▸ hooks/</span>
    <span className="mt-1.5 block font-sans text-[0.72rem] text-muted">conventions the agents load every session</span>
  </Window>
);

const LlmVisual = () => (
  <div aria-hidden="true" className="flex h-full flex-col justify-center rounded-2xl border border-line bg-bg p-4">
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-md border border-line bg-panel px-2 py-1 font-mono text-[0.72rem]">NPN 1•••••7</span>
      <span className="text-muted">→</span>
      <span className="whitespace-nowrap rounded-md border border-line px-2 py-1 text-[0.72rem] font-semibold">OpenAI, Gemini</span>
    </div>
    <div className="mt-3 rounded-lg border border-link/30 bg-tint p-2.5">
      <span className="block text-[0.72rem] font-semibold text-link">Agent bio, drafted</span>
      <div className="mt-2 space-y-1.5">
        <Bar w="95%" className="bg-link/25" />
        <Bar w="88%" className="bg-link/25" />
        <Bar w="60%" className="bg-link/25" />
      </div>
    </div>
  </div>
);

const ITEMS = [
  {
    title: "Claude Code, every day",
    text: "It's my main coding tool for features, refactors, tests and reviews, at work and on side projects.",
    Visual: DailyVisual,
  },
  {
    title: "Parallel agents, checked in a browser",
    text: "I run several agents at once, as subagents or in separate worktrees, and have them check the UI with Chrome DevTools.",
    Visual: ParallelVisual,
  },
  {
    title: "Skills, CLAUDE.md and hooks",
    text: "I write custom skills, CLAUDE.md rules and hooks so the agents follow the repo's conventions.",
    Visual: RulesVisual,
  },
  {
    title: "LLM features in production",
    text: "At Renegade I shipped a feature that drafts agent bios from their licensing (NPN) data with the OpenAI and Gemini APIs.",
    Visual: LlmVisual,
  },
];

const TOOLS = ["Claude Code", "Cursor", "GitHub Copilot", "Chrome DevTools", "OpenAI API", "Gemini API"];

const AiWork = () => (
  <>
    <ul className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map(({ title, text, Visual }) => (
        <li key={title}>
          <div className="h-[11.5rem]">
            <Visual />
          </div>
          <h3 className="mt-5 text-[1.2rem] font-bold leading-snug">{title}</h3>
          <p className="mt-2 text-[1rem] text-muted">{text}</p>
        </li>
      ))}
    </ul>
    <p className="mt-12 max-w-[52rem] text-muted">
      <span className="font-bold text-fg">Tools: </span>
      {TOOLS.join(", ")}. I also built <a href="#clairvoy">clairvoy</a> to see where Claude Code's tokens go.
    </p>
  </>
);

export default AiWork;
