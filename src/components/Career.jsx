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
          <ul className="mt-3 space-y-1.5 text-[1rem] text-muted">
            {e.highlights.map((h) => (
              <li key={h} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted">
                <Rich text={h} />
              </li>
            ))}
          </ul>
          {e.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tech used">
              {e.tags.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </li>
    ))}
  </ol>
);

export const Toolkit = ({ groups }) => (
  <div className="surface h-full p-5 sm:p-6">
    <h3 className="text-[1.15rem] font-bold">Toolkit</h3>
    <dl className="mt-4 space-y-3">
      {groups.map((g) => (
        <div key={g.group} className="grid grid-cols-1 gap-1.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline">
          <dt className="text-[0.9rem] font-semibold text-muted">{g.group}</dt>
          <dd>
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((t) => (
                <li key={t} className="rounded-md border border-line bg-bg px-2 py-0.5 text-[0.85rem] font-semibold">
                  {t}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export const Education = ({ edu, resume }) => (
  <div className="surface-tint flex h-full flex-col p-5 sm:p-6">
    <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-link text-bg">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9l10-5 10 5-10 5L2 9z" />
        <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
        <path d="M22 9v6" />
      </svg>
    </span>
    <h3 className="mt-4 text-[1.15rem] font-bold">Education</h3>
    <p className="mt-2 font-semibold leading-snug">{edu.degree}</p>
    <p className="mt-1 text-[0.95rem] text-muted">{edu.school}</p>
    <p className="mt-1 text-[0.95rem] text-muted tnum">{edu.years}</p>
    <p className="mt-auto pt-5">
      <a href={resume} target="_blank" rel="noopener noreferrer" className="font-semibold">
        Full CV (PDF)
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </p>
  </div>
);
