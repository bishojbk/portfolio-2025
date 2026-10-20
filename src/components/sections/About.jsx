import React from "react";
import data from "../../json/data.json";
import { SectionHeading } from "../ui";

const About = () => (
  <section id="about" aria-labelledby="about-title" className="pt-24">
    <SectionHeading n="03" id="about-title" title="About" />
    <div data-reveal className="mt-8 max-w-prose space-y-5 text-[1.12rem] leading-[1.7] text-ink-2">
      {data.about.map((para, i) => (
        <p
          key={i}
          className={
            i === 0
              ? "text-ink first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-display first-letter:text-[4.4rem] first-letter:leading-[0.78] first-letter:text-accent"
              : undefined
          }
        >
          {para}
        </p>
      ))}
    </div>

    <div data-reveal className="mt-12">
      <h3 className="kicker">Toolkit</h3>
      <dl className="mt-4 border-t border-rule">
        {data.toolkit.map((g) => (
          <div
            key={g.group}
            className="grid gap-x-8 gap-y-1 border-b border-rule py-3.5 sm:grid-cols-[8.5rem_minmax(0,1fr)]"
          >
            <dt className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-3 sm:pt-0.5">
              {g.group}
            </dt>
            <dd className="text-ink">
              {g.items.map((item, i) => (
                <React.Fragment key={item}>
                  {i > 0 && (
                    <span aria-hidden="true" className="px-2 text-rule">
                      /
                    </span>
                  )}
                  {item}
                </React.Fragment>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>

    <div data-reveal className="mt-12 grid gap-x-8 gap-y-1 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
      <h3 className="kicker sm:pt-1">
        Education <span className="text-rule">/</span> {data.education.year}
      </h3>
      <p>
        <span className="font-display text-[1.5rem] leading-tight">{data.education.degree}</span>
        <span className="mt-1 block text-[0.95rem] text-ink-2">
          {data.education.school}
        </span>
      </p>
    </div>
  </section>
);

export default About;
