import React from "react";
import data from "../../json/data.json";
import Figure from "./Figure";
import { Arrow, Dash, SectionHeading, Tags } from "../ui";

const Case = ({ item, n }) => {
  const primary = item.links[0];
  return (
    <article data-reveal className="group border-b border-rule py-10 sm:py-12">
      <Figure figure={item.figure} n={n} />
      <div className="mt-7">
        <p className="kicker">{item.kicker}</p>
        <h3 className="mt-2 font-display text-[clamp(2rem,3.6vw,2.6rem)] leading-[1.05]">
          {primary ? (
            <a
              href={primary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-accent"
            >
              {item.title} <Arrow className="text-ink-3" />
            </a>
          ) : (
            item.title
          )}
        </h3>
        <p className="mt-3 max-w-prose text-ink-2">{item.summary}</p>
        <ul className="mt-5 max-w-prose space-y-2.5">
          {item.outcomes.map((o) => (
            <li key={o} className="flex gap-3">
              <Dash />
              <span>{o}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Tags items={item.stack} />
          {primary ? (
            <a
              href={primary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link link font-mono text-[0.78rem] uppercase tracking-[0.12em]"
              aria-label={`${primary.label}: ${item.title}`}
            >
              {primary.label} <Arrow />
            </a>
          ) : (
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-3">
              {item.note}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

const Work = () => (
  <section id="work" aria-labelledby="work-title" className="pt-20 sm:pt-24">
    <SectionHeading n="01" id="work-title" title="Selected work" aside="2023 – now" />
    <div>
      {data.featured.map((item, i) => (
        <Case key={item.id} item={item} n={i + 1} />
      ))}
    </div>

    <div className="mt-14" data-reveal>
      <h3 className="kicker">More work</h3>
      <ul className="mt-4 border-t border-rule">
        {data.moreWork.map((w) => (
          <li key={w.title} className="border-b border-rule">
            <a
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-4 sm:grid-cols-[12rem_minmax(0,1fr)_7.5rem]"
            >
              <span className="font-display text-[1.45rem] leading-tight transition-colors duration-200 group-hover:text-accent">
                {w.title}
              </span>
              <span className="order-3 col-span-2 text-[0.9rem] text-ink-2 sm:order-none sm:col-span-1">
                {w.detail}
              </span>
              <span className="whitespace-nowrap text-right font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-3">
                {w.kind} <Arrow />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Work;
