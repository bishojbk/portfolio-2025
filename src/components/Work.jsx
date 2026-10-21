import React, { useCallback, useEffect, useRef, useState } from "react";
import { DemoVideo, MiniTerminal, Shot, Terminal } from "./Media";

const ext = { target: "_blank", rel: "noopener noreferrer" };
const mq = (q) => typeof window !== "undefined" && window.matchMedia(q).matches;
const canHover = () => mq("(hover: hover) and (pointer: fine)");
const reducedMotion = () => mq("(prefers-reduced-motion: reduce)");

/* ---------- Card ---------- */

// The card's preview. Recordings play only while the card is hovered or focused,
// so nothing moves on its own. Previews are decorative: the dialog has the described media.
const Preview = ({ p, active }) => {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active && !reducedMotion()) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  if (p.media.type === "terminal") return <MiniTerminal />;
  if (p.media.type === "video")
    return (
      <video
        ref={ref}
        className="h-full w-full object-cover object-left-top"
        width="960"
        height="600"
        muted
        loop
        playsInline
        preload="none"
        poster={p.media.poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={p.media.src} type="video/mp4" />
      </video>
    );
  return (
    <img
      src={p.media.src}
      srcSet={`${p.media.src.replace(".webp", "-640.webp")} 640w, ${p.media.src} ${p.media.width}w`}
      sizes="(min-width: 768px) 40rem, 100vw"
      width={p.media.width}
      height={p.media.height}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
};

const Card = ({ p, onOpen }) => {
  const [active, setActive] = useState(false);
  const isVideo = p.media.type === "video";
  return (
    <article
      id={p.id}
      className={`card rise group flex flex-col ${p.span}`}
      onMouseEnter={() => canHover() && setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-panel md:aspect-auto md:h-[19rem]">
        <Preview p={p} active={active} />
        {isVideo && (
          <span
            aria-hidden="true"
            className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-bg/95 px-2.5 py-1 text-[0.75rem] font-semibold text-fg shadow-sm"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-bad motion-safe:animate-pulse" : "bg-muted"}`} />
            {active ? "Playing recording" : "Real recording"}
          </span>
        )}
        {p.stats && (
          // Visual summary only; the same numbers are in the dialog and the Experience section.
          <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-2" aria-hidden="true">
            {p.stats.map(([n, l]) => (
              <div key={l} className="rounded-lg bg-bg/95 px-2.5 py-1.5 shadow-sm">
                <div className="text-[1.05rem] font-bold leading-tight tnum">{n}</div>
                <div className="text-[0.72rem] font-semibold text-muted">{l}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="kicker">{p.kind}</p>
        <h3 className="mt-1.5 text-[1.3rem] leading-snug">
          <button type="button" className="stretched" onClick={(e) => onOpen(p.id, e.currentTarget)}>
            {p.title}
            <span className="sr-only">, open details</span>
          </button>
        </h3>
        <p className="mt-1.5 text-[1rem] text-muted">{p.short}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
            {p.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-fg transition-colors group-hover:border-link group-hover:bg-link group-hover:text-bg"
          >
            ↗
          </span>
        </div>
      </div>
    </article>
  );
};

/* ---------- Dialog ---------- */

const LiveEmbed = ({ embed, onClose }) => (
  <figure>
    <div className="overflow-hidden rounded-xl border border-line bg-panel">
      <iframe
        src={embed.url}
        title={embed.title}
        className="block h-[min(760px,70vh)] w-full bg-bg"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
    <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.95rem] text-muted">
      <span>This is the real app, running inside this page.</span>
      <button type="button" onClick={onClose} className="font-semibold text-link underline underline-offset-[3px]">
        Back to the recording
      </button>
    </figcaption>
  </figure>
);

const DialogMedia = ({ p, live, setLive }) => {
  if (live && p.embed) return <LiveEmbed embed={p.embed} onClose={() => setLive(false)} />;
  if (p.media.type === "video") return <DemoVideo media={p.media} />;
  if (p.media.type === "terminal") return <Terminal />;
  return <Shot media={p.media} />;
};

const ProjectDialog = ({ p, onClose }) => {
  const ref = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (p && !d.open) {
      setLive(false);
      d.showModal();
      d.scrollTop = 0;
    } else if (!p && d.open) d.close();
  }, [p]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="pd-title"
      className="pd m-auto max-h-[92vh] w-[min(60rem,calc(100vw-1.5rem))] max-w-none overflow-y-auto rounded-2xl border border-line bg-bg p-0 text-fg shadow-2xl"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // A click on the backdrop lands on the <dialog> element itself.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {p && (
        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="kicker">{p.kind}</p>
              <h2 id="pd-title" className="mt-1.5 text-[1.7rem] font-bold sm:text-[2rem]">
                {p.title}
              </h2>
            </div>
            <button type="button" onClick={onClose} className="btn shrink-0 px-3" aria-label="Close">
              <span aria-hidden="true" className="text-[1.2rem] leading-none">
                ×
              </span>
            </button>
          </div>

          <div className="mt-5">
            <DialogMedia p={p} live={live} setLive={setLive} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="max-w-text">
              <p>{p.summary}</p>
              {p.details.map((d) => (
                <p key={d} className="mt-3 text-muted">
                  {d}
                </p>
              ))}
            </div>
            <div className="space-y-4">
              <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
                {p.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-2">
                {p.embed && !live && (
                  <li>
                    <button type="button" className="btn btn-primary w-full justify-center" onClick={() => setLive(true)}>
                      Try it here
                    </button>
                  </li>
                )}
                {p.links.map((l) => (
                  <li key={l.url}>
                    <a className="btn w-full justify-center" href={l.url} {...ext}>
                      {l.label} <span aria-hidden="true">↗</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};

/* ---------- Section ---------- */

const Work = ({ projects, alsoBuilt }) => {
  const [openId, setOpenId] = useState(null);
  const trigger = useRef(null);
  const pushed = useRef(false);

  // Each project has its own link (e.g. /#a11y-beast) that opens its details.
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.slice(1);
      setOpenId(projects.some((p) => p.id === id) ? id : null);
      if (!projects.some((p) => p.id === id)) pushed.current = false;
    };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [projects]);

  const open = useCallback((id, el) => {
    trigger.current = el;
    window.history.pushState({ project: id }, "", `#${id}`);
    pushed.current = true;
    setOpenId(id);
  }, []);

  const close = useCallback(() => {
    // Opened from a card: step back so the browser's Back button stays honest.
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setOpenId(null);
    const el = trigger.current;
    if (el) requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }, []);

  const current = projects.find((p) => p.id === openId) || null;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {projects.map((p) => (
          <Card key={p.id} p={p} onOpen={open} />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <h3 className="text-[1rem] font-bold">Also built</h3>
        <ul className="flex flex-wrap gap-2">
          {alsoBuilt.map((a) => (
            <li key={a.url}>
              <a
                href={a.url}
                {...ext}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[0.9rem] font-semibold text-fg no-underline transition-colors hover:border-link hover:text-link"
              >
                {a.label}
                {a.note && <span className="font-normal text-muted">· {a.note}</span>}
                <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <ProjectDialog p={current} onClose={close} />
    </>
  );
};

export default Work;
