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
      className="h-full w-full object-cover object-left-top"
    />
  );
};

// Each project sits on a stage in its product's own colour, with the media rising from the bottom edge.
const Stage = ({ p, active }) => (
  <div
    className="relative overflow-hidden rounded-[1.75rem] px-5 pt-5 sm:px-8 sm:pt-8"
    style={{ "--stage": p.stage, background: "rgb(var(--stage) / var(--stage-a, 0.16))" }}
  >
    {p.media.type === "video" && (
      <span
        aria-hidden="true"
        className="absolute left-3 top-3 z-[2] inline-flex items-center gap-1.5 rounded-full bg-bg px-2.5 py-1 text-[0.75rem] font-semibold text-fg sm:left-4 sm:top-4"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-bad" : "bg-muted"}`} />
        {active ? "Playing" : "Real recording"}
      </span>
    )}
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-t-xl ring-1 ring-black/10"
      style={{ boxShadow: "0 -12px 40px -16px rgb(var(--stage) / 0.55)" }}
    >
      <Preview p={p} active={active} />
    </div>
  </div>
);

const Card = ({ p, onOpen }) => {
  const [active, setActive] = useState(false);
  const wide = p.layout.startsWith("wide");
  const reverse = p.layout === "wide-reverse";
  return (
    <article
      id={p.id}
      className={`proj group relative ${wide ? "md:col-span-12 md:grid md:grid-cols-12 md:items-center md:gap-10" : "md:col-span-6"}`}
      onMouseEnter={() => canHover() && setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <div className={wide ? `md:col-span-8 ${reverse ? "md:order-2" : ""}` : ""}>
        <Stage p={p} active={active} />
      </div>
      <div className={`mt-5 ${wide ? "md:col-span-4 md:mt-0" : ""}`}>
        <p className="text-[0.9rem] text-muted">{p.kind}</p>
        <h3 className={`mt-1 leading-tight ${wide ? "text-[1.75rem]" : "text-[1.4rem]"}`}>
          <button type="button" className="stretched underline-offset-4 group-hover:underline" onClick={(e) => onOpen(p.id, e.currentTarget)}>
            {p.title}
            <span className="sr-only">, open details</span>
          </button>
        </h3>
        <p className="mt-2 max-w-[34rem]">{p.short}</p>
        <p className="mt-2 text-[0.9rem] text-muted">
          <span className="sr-only">Built with </span>
          {p.tags.join(", ")}
        </p>
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
              <p className="text-[0.9rem] text-muted">{p.kind}</p>
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
              <p className="text-[0.9rem] text-muted">
                <span className="font-semibold text-fg">Built with</span> {p.tags.join(", ")}
              </p>
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
                      {l.label}
                      <span className="sr-only"> (opens in a new tab)</span>
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
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12">
        {projects.map((p) => (
          <Card key={p.id} p={p} onOpen={open} />
        ))}
      </div>

      <p className="mt-14 max-w-[52rem] text-muted">
        <span className="font-bold text-fg">Also built: </span>
        {alsoBuilt.map((a, i) => (
          <React.Fragment key={a.url}>
            <a href={a.url} {...ext}>
              {a.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {a.note && ` (${a.note})`}
            {i < alsoBuilt.length - 1 ? ", " : "."}
          </React.Fragment>
        ))}
      </p>

      <ProjectDialog p={current} onClose={close} />
    </>
  );
};

export default Work;
