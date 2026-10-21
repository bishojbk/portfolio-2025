import React, { useState } from "react";
import { DemoVideo, Shot, Terminal } from "./Media";

const Media = ({ media }) => {
  if (media.type === "video") return <DemoVideo media={media} />;
  if (media.type === "terminal") return <Terminal />;
  return <Shot media={media} />;
};

// The live app, loaded only when asked for so it costs nothing on page load.
const LiveEmbed = ({ embed, onClose }) => (
  <figure>
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      <iframe
        src={embed.url}
        title={embed.title}
        className="block h-[760px] w-full bg-bg"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
    <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.95rem] text-muted">
      <span>This is the real app running inside this page.</span>
      <button type="button" onClick={onClose} className="font-semibold text-link underline underline-offset-[3px]">
        Back to the recording
      </button>
    </figcaption>
  </figure>
);

const Project = ({ p }) => {
  const [live, setLive] = useState(false);
  return (
    <article id={p.id} aria-labelledby={`${p.id}-title`} className="border-t border-line pt-10">
      <div className="max-w-text">
        <p className="text-[0.95rem] text-muted">{p.kind}</p>
        <h3 id={`${p.id}-title`} className="mt-1 text-[1.6rem] font-bold">
          {p.title}
        </h3>
        <p className="mt-3">{p.summary}</p>
        {p.details.map((d) => (
          <p key={d} className="mt-3 text-muted">
            {d}
          </p>
        ))}
      </div>

      <div className="mt-6">
        {live && p.embed ? <LiveEmbed embed={p.embed} onClose={() => setLive(false)} /> : <Media media={p.media} />}
      </div>

      <ul className="mt-5 flex flex-wrap gap-3">
        {p.embed && !live && (
          <li>
            <button type="button" className="btn btn-primary" onClick={() => setLive(true)}>
              Try it here
            </button>
          </li>
        )}
        {p.links.map((l) => (
          <li key={l.url}>
            <a className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label} <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Project;
