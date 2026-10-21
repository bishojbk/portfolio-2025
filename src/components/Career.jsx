import React from "react";

// "**text**" in the data becomes <strong>, so numbers stand out without HTML in JSON.
const Rich = ({ text }) =>
  text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-bold text-fg">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );

export const Experience = ({ items }) => (
  <ol className="relative">
    {items.map((e, i) => (
      <li key={e.company} className="relative grid grid-cols-1 gap-x-12 pb-10 last:pb-0 md:grid-cols-[11rem_minmax(0,1fr)]">
        {/* Timeline rail and dot: in the gutter on wide screens, on the left edge on phones. */}
        {i < items.length - 1 && (
          <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-4 w-px bg-line md:left-[calc(11rem+1.5rem)]" />
        )}
        <span
          aria-hidden="true"
          className={`absolute left-0 top-[0.45rem] h-[11px] w-[11px] rounded-full md:left-[calc(11rem+1.5rem-5px)] ${
            e.current ? "bg-link ring-4 ring-link/20" : "border-2 border-line bg-bg"
          }`}
        />

        <div className="flex items-center gap-2 pl-7 md:flex-col md:items-end md:gap-1 md:pl-0 md:pt-0.5">
          <span className="text-[0.95rem] text-muted tnum">{e.dates}</span>
          {e.current && <span className="rounded-full bg-tint px-2 py-0.5 text-[0.75rem] font-bold text-link">Now</span>}
        </div>
        <div className="mt-1 pl-7 md:mt-0 md:pl-0">
          <h3 className="text-[1.2rem] font-bold leading-snug">
            {e.role} <span className="font-normal text-muted">at</span> {e.company}
          </h3>
          <p className="text-[0.95rem] text-muted">{e.where}</p>
          <ul className="mt-3 max-w-[35rem] space-y-1.5 text-[1rem] text-muted">
            {e.highlights.map((h) => (
              <li key={h} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted">
                <Rich text={h} />
              </li>
            ))}
          </ul>
          {e.tags.length > 0 && (
            <p className="mt-3 max-w-[35rem] text-[0.9rem] text-muted">
              <span className="font-semibold text-fg">Stack</span> {e.tags.join(", ")}
            </p>
          )}
        </div>
      </li>
    ))}
  </ol>
);

export const Toolkit = ({ groups }) => (
  <div>
    <h2 id="toolkit-title" className="text-[1.75rem] font-bold">
      Toolkit
    </h2>
    <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {groups.map((g) => (
        <div key={g.group}>
          <dt className="font-bold">{g.group}</dt>
          <dd className="mt-0.5 text-muted">{g.items.join(", ")}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export const Education = ({ edu, resume }) => (
  <div className="rounded-[1.75rem] bg-tint p-6 sm:p-7">
    <h2 id="edu-title" className="text-[1.75rem] font-bold">
      Education
    </h2>
    <p className="mt-4 font-bold leading-snug">{edu.degree}</p>
    <p className="mt-1 text-muted">{edu.school}</p>
    <p className="mt-1 text-muted tnum">{edu.years}</p>
    <p className="mt-6">
      <a href={resume} target="_blank" rel="noopener noreferrer" className="font-semibold">
        Open the full CV (PDF)
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </p>
  </div>
);
