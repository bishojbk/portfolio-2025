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
const RATING_CLASS = { good: "text-[#81C995]", ok: "text-[#FDD663]", poor: "text-[#F28B82]" };

const ms = (v) => (v == null ? "…" : v < 1000 ? `${Math.round(v)} ms` : `${(v / 1000).toFixed(2)} s`);
const kb = (b) => `${(b / 1024).toFixed(b < 10240 ? 1 : 0)} KB`;

/* ---------- The page's own network waterfall ---------- */

// Colours are fixed: the panel is dark in both themes.
// Request-type colours follow Chrome DevTools' own network panel.
const TYPES = {
  doc: { label: "HTML", color: "#8AB4F8" },
  css: { label: "CSS", color: "#C58AF9" },
  js: { label: "JavaScript", color: "#FDD663" },
  font: { label: "Fonts", color: "#78D9EC" },
  img: { label: "Images", color: "#81C995" },
};
const ROWS = 7;

const kindOf = (r) => {
  const n = r.name.split("?")[0];
  if (/\.css$/.test(n)) return "css";
  if (/\.m?js$/.test(n) || r.initiatorType === "script") return "js";
  if (/\.woff2?$/.test(n)) return "font";
  if (/\.(webp|png|jpe?g|svg|gif|avif)$/.test(n)) return "img";
  return null;
};

const nameOf = (url, kind) => {
  const file = url.split("?")[0].split("/").pop() || url;
  if (kind === "font") return /mono/.test(file) ? "Atkinson Mono" : "Atkinson Next";
  // Drop Vite's content hash: index-8aa7bdfc.css -> index.css
  return file.replace(/-[0-9a-f]{8}(\.\w+)$/, "$1");
};

function snapshot() {
  const nav = performance.getEntriesByType("navigation")[0];
  const rows = [];
  if (nav) rows.push({ name: "index.html", kind: "doc", start: 0, end: nav.responseEnd, size: nav.transferSize || 0 });
  performance
    .getEntriesByType("resource")
    .map((r) => ({ r, kind: kindOf(r) }))
    .filter(({ kind }) => kind)
    .sort((a, b) => a.r.startTime - b.r.startTime)
    .forEach(({ r, kind }) =>
      rows.push({ name: nameOf(r.name, kind), kind, start: r.startTime, end: r.responseEnd, size: r.transferSize || 0 })
    );
  const shown = rows.slice(0, ROWS);
  const all = [nav, ...performance.getEntriesByType("resource")].filter(Boolean);
  const total = all.reduce((n, e) => n + (e.transferSize || 0), 0);
  const js = performance
    .getEntriesByType("resource")
    .filter((e) => kindOf(e) === "js")
    .reduce((n, e) => n + (e.transferSize || 0), 0);
  return { rows: shown, more: Math.max(0, rows.length - shown.length), total, js, load: nav ? nav.loadEventEnd : 0 };
}

const niceStep = (span) => [50, 100, 200, 250, 500, 1000, 2000, 5000].find((s) => span / s <= 5) || 10000;

const Waterfall = ({ data, fcp, lcp }) => {
  const rows = data ? data.rows : [];
  const end = data ? Math.max(data.load, lcp || 0, ...rows.map((r) => r.end)) : 1000;
  const step = niceStep(end);
  const max = Math.ceil((end * 1.04) / step) * step;
  const x = (t) => `${Math.min(100, (t / max) * 100)}%`;
  const ticks = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);

  return (
    <div>
      {/* Screen readers get the same data as a table. The wrapper does the hiding:
          a <table> ignores the 1px width and would make phones scroll sideways. */}
      <div className="sr-only">
      <table>
        <caption>Requests this page made while loading</caption>
        <thead>
          <tr>
            <th scope="col">File</th>
            <th scope="col">Type</th>
            <th scope="col">Started</th>
            <th scope="col">Took</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name + r.start}>
              <td>{r.name}</td>
              <td>{TYPES[r.kind].label}</td>
              <td>{ms(r.start)}</td>
              <td>{ms(r.end - r.start)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div aria-hidden="true" className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.5rem] items-center gap-x-3 text-[0.75rem]">
        {Array.from({ length: ROWS }, (_, i) => {
          const r = rows[i];
          return (
            <React.Fragment key={i}>
              <span className="truncate py-[3px] text-[#BDC1C6]">{r ? r.name : " "}</span>
              <span className="relative h-2.5 rounded-sm bg-white/[0.06]">
                {r && (
                  <span
                    className="wf-bar absolute inset-y-0 rounded-sm"
                    style={{
                      left: x(r.start),
                      width: `max(3px, ${x(r.end - r.start)})`,
                      background: TYPES[r.kind].color,
                      animationDelay: `${i * 90}ms`,
                    }}
                  />
                )}
              </span>
              <span className="text-right tabular-nums text-[#BDC1C6]">{r ? ms(r.end - r.start) : " "}</span>
            </React.Fragment>
          );
        })}

        {/* Time axis with FCP and LCP markers, lined up with the bar column. */}
        <span />
        <span className="relative mt-1 h-5 border-t border-white/15">
          {/* Ticks appear once the snapshot exists, rather than sliding into place. */}
          {data && ticks.map((t) => (
            <span key={t} className="absolute top-1 -translate-x-1/2 tabular-nums text-[0.68rem] text-[#9AA0A6]" style={{ left: x(t) }}>
              {t === 0 ? "0" : t < 1000 ? t : `${t / 1000}s`}
            </span>
          ))}
        </span>
        <span />
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.72rem] text-[#BDC1C6]" aria-hidden="true">
        {Object.entries(TYPES).map(([k, t]) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ background: t.color }} />
            {t.label}
          </span>
        ))}
        {data && data.more > 0 && <span>and {data.more} more</span>}
      </div>
      {/* Markers are listed rather than drawn, so a late LCP update never moves anything. */}
      <p className="sr-only">
        First content appeared at {ms(fcp)}, the largest at {ms(lcp)}.
      </p>
    </div>
  );
};

/* ---------- Readouts and the accessibility check ---------- */

const Readout = ({ label, abbr, title, value, rate, hint }) => (
  <div className="min-w-0">
    <dt className="truncate text-[0.75rem] font-semibold text-[#BDC1C6]">
      {label}
      {abbr && (
        <>
          {" "}
          <abbr title={title} className="font-normal text-[#9AA0A6] no-underline">
            {abbr}
          </abbr>
        </>
      )}
    </dt>
    <dd className="text-[1.15rem] font-bold leading-tight tabular-nums text-[#E8EAED]">{value}</dd>
    <dd className={`truncate text-[0.72rem] font-semibold ${rate ? RATING_CLASS[rate] : "text-[#9AA0A6]"}`}>
      {rate ? RATING_TEXT[rate] : hint || " "}
    </dd>
  </div>
);

const IMPACT_CLASS = { critical: "text-[#F28B82]", serious: "text-[#F28B82]", moderate: "text-[#FDD663]", minor: "text-[#BDC1C6]" };

const LiveChecks = () => {
  const [v, setV] = useState({});
  const [data, setData] = useState(null);
  const [s, setS] = useState({ state: "idle" });

  useEffect(() => {
    const set = (m) => setV((prev) => ({ ...prev, [m.name]: m.value }));
    onLCP(set, { reportAllChanges: true });
    onFCP(set);
    onCLS(set, { reportAllChanges: true });
    onINP(set, { reportAllChanges: true });

    // Take one snapshot just after load, so the chart draws once and then stays put.
    const take = () => setTimeout(() => setData(snapshot()), 300);
    if (document.readyState === "complete") take();
    else window.addEventListener("load", take, { once: true });
    return () => window.removeEventListener("load", take);
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
      setS({ state: "done", violations: r.violations, passes: r.passes.length, ms: performance.now() - t0, version: axe.version });
    } catch (e) {
      setS({ state: "error", message: e?.message || "The check could not run." });
    }
  };

  const issues = s.state === "done" ? s.violations.reduce((n, x) => n + x.nodes.length, 0) : 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-term p-5 text-[#E8EAED] shadow-[0_40px_80px_-40px_rgb(32_33_36/0.7)] sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[1.05rem] font-bold">This page, loading in your browser</h2>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[0.75rem] font-semibold text-[#81C995]">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#81C995] motion-safe:animate-pulse" />
          Live
        </span>
      </div>
      <p className="mt-1 text-[0.82rem] text-[#BDC1C6]">
        Real timings from your visit, read from the browser's Performance API. Nothing is hard-coded.
      </p>

      <div className="mt-4">
        <Waterfall data={data} fcp={v.FCP} lcp={v.LCP} />
      </div>

      {/* Plain words first; the Core Web Vitals names are there for people who know them. */}
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 border-t min-[360px]:grid-cols-2 border-white/10 pt-4">
        <Readout label="Content shown" abbr="LCP" title="Largest Contentful Paint" value={ms(v.LCP)} rate={rating("LCP", v.LCP)} />
        <Readout label="Layout shift" abbr="CLS" title="Cumulative Layout Shift" value={v.CLS == null ? "…" : v.CLS.toFixed(3)} rate={rating("CLS", v.CLS)} />
        <Readout
          label="Response to taps"
          abbr="INP"
          title="Interaction to Next Paint"
          value={v.INP == null ? "–" : ms(v.INP)}
          rate={rating("INP", v.INP)}
          hint="Tap anything to measure"
        />
        <Readout label="Page size" value={data ? kb(data.total) : "…"} hint={data ? `${kb(data.js)} of it JavaScript` : ""} />
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={run}
          disabled={s.state === "loading"}
          className="inline-flex min-w-[10.5rem] shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#8AB4F8] px-3 py-1.5 text-[0.9rem] font-bold text-[#202124] transition-[filter] hover:brightness-110 focus-visible:outline-[#8AB4F8]"
        >
          {s.state === "loading" ? "Checking…" : s.state === "done" ? "Check again" : "Check accessibility"}
        </button>
        {/* Same two lines in every state, so the result never moves the page. */}
        <div aria-live="polite" className="min-w-[12rem] flex-1 text-[0.82rem] leading-snug">
          <p className="truncate font-bold">
            {s.state === "done" ? (
              <span className={s.violations.length ? "text-[#F28B82]" : "text-[#81C995]"}>
                {s.violations.length === 0 ? "No violations found" : `${issues} issue${issues === 1 ? "" : "s"} found`}
              </span>
            ) : s.state === "error" ? (
              <span className="text-[#F28B82]">The check didn't run</span>
            ) : (
              <span className="text-[#BDC1C6]">{s.state === "loading" ? "Running axe-core…" : "Runs axe-core on this page"}</span>
            )}
          </p>
          <p className="truncate text-[#BDC1C6] tabular-nums">
            {s.state === "done"
              ? `${s.passes} rules passed, axe-core ${s.version}, ${Math.round(s.ms)} ms`
              : s.state === "error"
              ? s.message
              : "About 150 KB, loaded only when pressed"}
          </p>
        </div>
      </div>
      {s.state === "done" && s.violations.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-[0.85rem]">
          {s.violations.map((x) => (
            <li key={x.id}>
              <span className={`font-semibold ${IMPACT_CLASS[x.impact] || ""}`}>{x.impact}</span>{" "}
              <a href={x.helpUrl} target="_blank" rel="noopener noreferrer" className="text-[#8AB4F8]">
                {x.help}
              </a>{" "}
              <span className="text-[#BDC1C6]">({x.nodes.length})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveChecks;
