import React from "react";
import data from "../../json/data.json";

const Highlights = () => (
  <section aria-labelledby="glance">
    <h2 id="glance" className="kicker">
      At a glance
    </h2>
    <dl className="mt-4 grid grid-cols-2 border-t border-rule">
      {data.highlights.map((h, i) => (
        <div
          key={h.label}
          data-reveal
          style={{ transitionDelay: `${i * 70}ms` }}
          className={`flex flex-col-reverse justify-end gap-2 border-b border-rule py-6 ${
            i % 2 === 0 ? "pr-5 sm:pr-8" : "border-l pl-5 sm:pl-8"
          }`}
        >
          <dt className="max-w-[24ch] text-[0.9rem] leading-snug text-ink-2">{h.label}</dt>
          <dd className="font-display text-[clamp(2.6rem,5vw,3.6rem)] leading-none tracking-[-0.01em]">
            {h.value}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

export default Highlights;
