import React, { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Muted demo recording. Plays only while on screen, never with reduced motion,
// and always has a visible pause button (WCAG 2.2.2).
export const DemoVideo = ({ media }) => {
  const ref = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current && !reducedMotion()) el.play().catch(() => {});
        else if (!entry.isIntersecting) el.pause();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  return (
    <figure>
      <div className="relative overflow-hidden rounded-xl border border-line bg-panel">
        <video
          ref={ref}
          className="block h-auto w-full"
          width="960"
          height="600"
          muted
          loop
          playsInline
          preload="none"
          poster={media.poster}
          aria-label={media.label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={media.src} type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={toggle}
          className="btn absolute bottom-2 left-2 gap-0 bg-bg/95 px-2.5 py-1 text-[0.8rem] shadow-sm sm:bottom-3 sm:left-3 sm:px-4 sm:gap-[0.3em] sm:py-1.5 sm:text-[0.9rem]"
        >
          {playing ? "Pause" : "Play"}
          {/* Short on phones so it covers less of the video; screen readers always hear the full label. */}
          <span className="sr-only sm:not-sr-only"> recording</span>
        </button>
      </div>
      <figcaption className="mt-2 text-[0.95rem] text-muted">{media.caption}</figcaption>
    </figure>
  );
};

export const Shot = ({ media }) => (
  <figure>
    <div className="overflow-hidden rounded-xl border border-line bg-panel">
      <img
        className="block h-auto w-full"
        src={media.src}
        width={media.width}
        height={media.height}
        alt={media.alt}
        loading="lazy"
        decoding="async"
      />
    </div>
    <figcaption className="mt-2 text-[0.95rem] text-muted">{media.caption}</figcaption>
  </figure>
);

// Output from `clairvoy demo` (the package's own scripted demo), trimmed.
const TERM = [
  ["cmd", "$ clairvoy analyze 5"],
  ["", ""],
  ["head", "  clairvoy — token usage analysis"],
  ["", "  Session:  cbfa0ac3..."],
  ["", "  Model:    claude-opus-4-6"],
  ["", "  Duration: 71h 40m"],
  ["", "  Turns:    217 prompts, 1181 tool calls"],
  ["", ""],
  ["head", "  COST BREAKDOWN  (API pricing)"],
  ["", "  Total: $450.69  (813,232,539 tokens)"],
  ["", "    Cache read     $403.26    806.5M @ $0.5/M   (89%)"],
  ["", "    Cache write     $40.09      6.4M @ $6.25/M  (9%)"],
  ["", "    Output           $7.31      0.3M @ $25/M    (2%)"],
  ["", ""],
  ["head", "  WHO CAUSED WHAT"],
  ["", "  You typed:          99,361 tokens     $0.50"],
  ["", "  Claude output:     645,844 tokens     $16.15"],
  ["hot", "  History re-sent:   807M tokens         $403.85 <- 99% of cost"],
  ["", ""],
  ["head", "  WASTE DETECTED"],
  ["hot", "  !! lead-form-drawer.tsx read 38 times (~13,949 tokens wasted)"],
  ["hot", "  !! use-leads-query.ts read 25 times (~6,624 tokens wasted)"],
  ["", "   ! leads-api.ts read 12 times (~3,498 tokens wasted)"],
  ["", ""],
  ["cmd", "$ clairvoy optimize --dry-run"],
  ["", "  + Track file reads (~5% savings, med confidence)"],
  ["", "  + Prefer code over explanation (~5% savings, med confidence)"],
  ["", "  + No trailing summaries (~3% savings, high confidence)"],
];

// The terminal is dark in both themes, so its colours are fixed rather than theme tokens.
const TONE = {
  cmd: "text-[#eef0f3] font-semibold",
  head: "text-[#8fb0ff] font-semibold",
  hot: "text-[#e9b864]",
  "": "text-[#a9afba]",
};

// The few lines of the same demo that tell the story, for the small card.
const MINI = [TERM[0], TERM[9], TERM[17], TERM[24], TERM[25]];

export const MiniTerminal = () => (
  <div aria-hidden="true" className="flex h-full flex-col bg-term font-mono text-[0.72rem] leading-[1.6] sm:text-[0.78rem]">
    <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
    </div>
    <div className="flex-1 overflow-hidden whitespace-pre px-3 py-3">
      {MINI.map(([tone, text], i) => (
        <span key={i} className={`block ${TONE[tone]} ${tone === "cmd" && i ? "mt-2" : ""}`}>
          {text.replace(/^  /, "")}
        </span>
      ))}
      <span className="mt-1 inline-block h-[1em] w-[0.55em] translate-y-[2px] bg-[#eef0f3] motion-safe:animate-pulse" />
    </div>
  </div>
);

export const Terminal = () => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setPlaying(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Remounting the <pre> restarts every line's animation.
  const replay = () => {
    setPlaying(true);
    setRun((n) => n + 1);
  };

  let delay = 0;
  return (
    <figure>
      <div className="overflow-hidden rounded-xl border border-line bg-term">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[0.85rem] text-[#a9afba]">
          <span>Terminal: clairvoy 0.1.0</span>
          <button type="button" onClick={replay} className="font-semibold text-[#8fb0ff] underline-offset-2 hover:underline">
            Replay
          </button>
        </div>
        <pre
          ref={ref}
          key={run}
          // It scrolls sideways on phones, so keyboard users need to be able to focus it.
          tabIndex={0}
          role="region"
          aria-label="Terminal output of clairvoy demo"
          className={`term ${playing ? "is-playing" : ""} overflow-x-auto p-4 font-mono text-[0.8rem] leading-[1.55] sm:text-[0.85rem]`}>
          {TERM.map(([tone, text], i) => {
            delay += tone === "cmd" ? 700 : 45;
            return (
              <span key={i} className={`term-line block ${TONE[tone]}`} style={{ animationDelay: `${delay}ms` }}>
                {text || " "}
              </span>
            );
          })}
        </pre>
      </div>
      <figcaption className="mt-2 text-[0.95rem] text-muted">
        Output of <code className="font-mono">clairvoy demo</code>, the tool's built-in walkthrough, trimmed.
      </figcaption>
    </figure>
  );
};
