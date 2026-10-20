import React from "react";
import data from "../../json/data.json";
import { Arrow, Dash, Rich, SectionHeading, Tags } from "../ui";

const Experience = () => (
  <section id="experience" aria-labelledby="experience-title" className="pt-24">
    <SectionHeading n="02" id="experience-title" title="Experience" aside="3+ years" />
    <ol>
      {data.experience.map((e) => (
        <li
          key={e.company}
          data-reveal
          className="grid gap-x-8 gap-y-3 border-b border-rule py-9 sm:grid-cols-[8.5rem_minmax(0,1fr)]"
        >
          <p className="pt-2 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-3">
            {e.start} <span aria-hidden="true">—</span>
            <span className="sr-only">to</span> {e.end}
          </p>
          <div>
            <h3 className="font-display text-[1.8rem] leading-tight">{e.role}</h3>
            <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group link font-medium text-ink"
              >
                {e.company} <Arrow className="text-ink-3" />
              </a>
              {e.where && <span className="kicker">{e.where}</span>}
            </p>
            <ul className="mt-4 max-w-prose space-y-2.5 text-ink-2">
              {e.points.map((pt) => (
                <li key={pt} className="flex gap-3">
                  <Dash />
                  <span>
                    <Rich text={pt} />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Tags items={e.stack} />
            </div>
          </div>
        </li>
      ))}
    </ol>
    <p className="mt-7">
      <a
        href={data.profile.resume}
        target="_blank"
        rel="noopener"
        className="group link font-mono text-[0.78rem] uppercase tracking-[0.12em]"
      >
        Full résumé (PDF) <Arrow />
      </a>
    </p>
  </section>
);

export default Experience;
