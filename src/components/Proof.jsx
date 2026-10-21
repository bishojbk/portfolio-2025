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

const Row = ({ label, help, value, rate }) => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-0.5 border-t border-line py-3 first:border-t-0">
    <dt>
      {label}
      {help && <span className="block text-[0.9rem] text-muted">{help}</span>}
    </dt>
    <dd className="min-w-[8ch] text-right font-mono tnum">
      {value}
      {rate && <span className={`block text-[0.85rem] font-sans font-semibold ${RATING_CLASS[rate]}`}>{RATING_TEXT[rate]}</span>}
    </dd>
  </div>
);

const Speed = () => {
  const [v, setV] = useState({});
  const [w, setW] = useState(null);

  useEffect(() => {
    const set = (m) => setV((s) => ({ ...s, [m.name]: m.value }));
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

  return (
    <div className="rounded-lg border border-line p-5 sm:p-6">
      <h3 className="text-[1.2rem] font-bold">Speed</h3>
      <p className="mt-1 text-[0.95rem] text-muted">Core Web Vitals for your visit, via Google's web-vitals library.</p>
      <dl className="mt-3">
        <Row label="Largest Contentful Paint" help="When the main content appeared" value={ms(v.LCP)} rate={rating("LCP", v.LCP)} />
        <Row label="Cumulative Layout Shift" help="How much things jumped around" value={v.CLS == null ? "…" : v.CLS.toFixed(3)} rate={rating("CLS", v.CLS)} />
        <Row
          label="Interaction to Next Paint"
          help={v.INP == null ? "Click or tap anything on the page to measure it" : "How quickly the page responded to you"}
          value={v.INP == null ? "waiting" : ms(v.INP)}
          rate={rating("INP", v.INP)}
        />
        <Row
          label="Downloaded so far"
          help={w && w.cached ? `${w.requests} requests, ${w.cached} from your browser cache` : w ? `${w.requests} requests` : "…"}
          value={w ? kb(w.total) : "…"}
        />
        <Row label="JavaScript" help="Compressed, over the network" value={w ? kb(w.js) : "…"} />
      </dl>
    </div>
  );
};

const IMPACT_CLASS = { critical: "text-bad", serious: "text-bad", moderate: "text-warn", minor: "text-muted" };

const Accessibility = () => {
  const [s, setS] = useState({ state: "idle" });

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
        at: new Date(),
      });
    } catch (e) {
      setS({ state: "error", message: e?.message || "The check could not run." });
    }
  };

  const issues = s.state === "done" ? s.violations.reduce((n, v) => n + v.nodes.length, 0) : 0;

  return (
    <div className="rounded-lg border border-line p-5 sm:p-6">
      <h3 className="text-[1.2rem] font-bold">Accessibility</h3>
      <p className="mt-1 text-[0.95rem] text-muted">
        Runs axe-core, the engine behind most accessibility testers, against this page in your browser.
      </p>
      <div className="mt-4">
        <button type="button" className="btn btn-primary" onClick={run} disabled={s.state === "loading"}>
          {s.state === "loading" ? "Checking…" : s.state === "done" ? "Run it again" : "Check this page"}
        </button>
      </div>
      {/* Every state has the same shape, so showing the result doesn't push the rest of the page down. */}
      <div aria-live="polite" className="mt-4">
        <p className="text-[1.6rem] font-bold leading-tight">
          {s.state === "done" ? (
            <span className={s.violations.length ? "text-bad" : "text-good"}>
              {s.violations.length === 0 ? "No violations found" : `${issues} issue${issues === 1 ? "" : "s"} found`}
            </span>
          ) : s.state === "error" ? (
            <span className="text-bad">The check didn't run</span>
          ) : (
            <span className="text-muted">{s.state === "loading" ? "Checking…" : "Not run yet"}</span>
          )}
        </p>
        <p className="mt-1 text-[0.95rem] text-muted tnum">
          {s.state === "done" ? (
            <>
              {s.passes} rules passed{s.incomplete ? `, ${s.incomplete} need a person to check` : ""}. axe-core {s.version},{" "}
              {Math.round(s.ms)} ms, at {s.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}.
            </>
          ) : s.state === "error" ? (
            s.message
          ) : (
            "It downloads about 150 KB the first time, so it isn't part of the page load."
          )}
        </p>
        {s.state === "done" && s.violations.length > 0 && (
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {s.violations.map((v) => (
              <li key={v.id}>
                <span className={`font-semibold ${IMPACT_CLASS[v.impact] || ""}`}>{v.impact}</span>{" "}
                <a href={v.helpUrl} target="_blank" rel="noopener noreferrer">
                  {v.help}
                </a>{" "}
                <span className="text-muted">({v.nodes.length})</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[0.9rem] text-muted">
          Automated checks catch only part of the problems. Keyboard and screen-reader testing still matter.
        </p>
      </div>
    </div>
  );
};

const Proof = () => (
  <div className="grid gap-5 md:grid-cols-2">
    <Speed />
    <Accessibility />
  </div>
);

export default Proof;
