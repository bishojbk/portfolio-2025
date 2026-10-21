import React, { useEffect, useState } from "react";
import { onCLS, onFCP, onINP, onLCP } from "web-vitals";

// Thresholds from web.dev: [good, needs improvement]
const LIMITS = { LCP: [2500, 4000], FCP: [1800, 3000], INP: [200, 500], CLS: [0.1, 0.25] };

const rating = (name, v) => {
  if (v == null) return null;
  const [good, ok] = LIMITS[name];
  return v <= good ? "good" : v <= ok ? "ok" : "poor";
};
const RATING_TEXT = { good: "Good", ok: "Needs work", poor: "Poor" };
const RATING_CLASS = { good: "text-good", ok: "text-warn", poor: "text-bad" };

const ms = (v) => (v == null ? "…" : v < 1000 ? `${Math.round(v)} ms` : `${(v / 1000).toFixed(2)} s`);
const kb = (b) => `${(b / 1024).toFixed(b < 10240 ? 1 : 0)} KB`;

function weigh() {
  const nav = performance.getEntriesByType("navigation")[0];
  const res = performance.getEntriesByType("resource");
  let total = nav ? nav.transferSize || 0 : 0;
  let js = 0;
  let cached = nav && nav.transferSize === 0 ? 1 : 0;
  res.forEach((r) => {
    total += r.transferSize || 0;
    if (r.transferSize === 0 && r.decodedBodySize > 0) cached += 1;
    if (r.initiatorType === "script" || /\.m?js(\?|$)/.test(r.name)) js += r.transferSize || 0;
  });
  return { total, js, requests: res.length + 1, cached };
}

const Tile = ({ label, abbr, value, rate, hint }) => (
  <div className="rounded-xl border border-line bg-bg px-3 py-2.5">
    <dt className="text-[0.78rem] font-semibold text-muted">
      {label} {abbr && <abbr className="no-underline">{abbr}</abbr>}
    </dt>
    <dd className="mt-0.5 font-mono text-[1.2rem] font-bold leading-tight tnum">{value}</dd>
    {/* Always one line tall, so a rating appearing never moves anything. */}
    <dd className={`truncate text-[0.78rem] font-semibold ${rate ? RATING_CLASS[rate] : "text-muted"}`}>
      {rate ? RATING_TEXT[rate] : hint || " "}
    </dd>
  </div>
);

const IMPACT_CLASS = { critical: "text-bad", serious: "text-bad", moderate: "text-warn", minor: "text-muted" };

const LiveChecks = () => {
  const [v, setV] = useState({});
  const [w, setW] = useState(null);
  const [s, setS] = useState({ state: "idle" });

  useEffect(() => {
    const set = (m) => setV((prev) => ({ ...prev, [m.name]: m.value }));
    onLCP(set, { reportAllChanges: true });
    onFCP(set);
    onCLS(set, { reportAllChanges: true });
    onINP(set, { reportAllChanges: true });

    const update = () => setW(weigh());
    update();
    window.addEventListener("load", update);
    let po;
    if ("PerformanceObserver" in window) {
      po = new PerformanceObserver(update);
      try {
        po.observe({ type: "resource", buffered: true });
      } catch (e) {
        /* older browsers */
      }
    }
    return () => {
      window.removeEventListener("load", update);
      if (po) po.disconnect();
    };
  }, []);

  const run = async () => {
    setS({ state: "loading" });
    try {
      const { default: axe } = await import("axe-core");
      const t0 = performance.now();
      const r = await axe.run(
        { exclude: [["iframe"]] },
        { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }
      );
      setS({
        state: "done",
        violations: r.violations,
        passes: r.passes.length,
        incomplete: r.incomplete.length,
        ms: performance.now() - t0,
        version: axe.version,
      });
    } catch (e) {
      setS({ state: "error", message: e?.message || "The check could not run." });
    }
  };

  const issues = s.state === "done" ? s.violations.reduce((n, x) => n + x.nodes.length, 0) : 0;

  return (
    <div className="surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[1.05rem] font-bold">This page, measured live</h2>
        <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-good">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-good motion-safe:animate-pulse" />
          In your browser
        </span>
      </div>
      <p className="mt-1 text-[0.85rem] text-muted">Core Web Vitals from Google's web-vitals library. Nothing is hard-coded.</p>

      <dl className="mt-3 grid grid-cols-2 gap-2">
        <Tile label="Load" abbr="LCP" value={ms(v.LCP)} rate={rating("LCP", v.LCP)} />
        <Tile label="Layout shift" abbr="CLS" value={v.CLS == null ? "…" : v.CLS.toFixed(3)} rate={rating("CLS", v.CLS)} />
        <Tile
          label="Response" abbr="INP"
          value={v.INP == null ? "–" : ms(v.INP)}
          rate={rating("INP", v.INP)}
          hint="Tap anything to measure"
        />
        <Tile label="Downloaded" abbr="" value={w ? kb(w.total) : "…"} hint={w ? `JavaScript: ${kb(w.js)}` : ""} />
      </dl>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line bg-bg px-3 py-2.5">
        <button type="button" className="btn btn-primary min-w-[10.5rem] shrink-0 justify-center whitespace-nowrap px-3 py-1.5 text-[0.9rem]" onClick={run} disabled={s.state === "loading"}>
          {s.state === "loading" ? "Checking…" : s.state === "done" ? "Check again" : "Check accessibility"}
        </button>
        {/* Same two lines in every state, so the result never pushes the page around. */}
        <div aria-live="polite" className="min-w-[12rem] flex-1 text-[0.85rem] leading-snug">
          <p className="truncate font-bold">
            {s.state === "done" ? (
              <span className={s.violations.length ? "text-bad" : "text-good"}>
                {s.violations.length === 0 ? "No violations found" : `${issues} issue${issues === 1 ? "" : "s"} found`}
              </span>
            ) : s.state === "error" ? (
              <span className="text-bad">The check didn't run</span>
            ) : (
              <span className="text-muted">{s.state === "loading" ? "Running axe-core…" : "axe-core, on this page"}</span>
            )}
          </p>
          <p className="truncate text-muted tnum">
            {s.state === "done"
              ? `${s.passes} rules passed · axe-core ${s.version} · ${Math.round(s.ms)} ms`
              : s.state === "error"
              ? s.message
              : "About 150 KB, loaded on demand"}
          </p>
        </div>
      </div>
      {s.state === "done" && s.violations.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-[0.9rem]">
          {s.violations.map((x) => (
            <li key={x.id}>
              <span className={`font-semibold ${IMPACT_CLASS[x.impact] || ""}`}>{x.impact}</span>{" "}
              <a href={x.helpUrl} target="_blank" rel="noopener noreferrer">
                {x.help}
              </a>{" "}
              <span className="text-muted">({x.nodes.length})</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[0.78rem] text-muted">Automated checks catch only part of the problems.</p>
    </div>
  );
};

export default LiveChecks;
