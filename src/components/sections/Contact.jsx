import React, { useEffect, useState } from "react";
import data from "../../json/data.json";
import { Arrow, SectionHeading } from "../ui";

const fmt = (tz) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(
    new Date()
  );

const LocalTime = ({ tz }) => {
  const [time, setTime] = useState(() => fmt(tz));
  useEffect(() => {
    const id = setInterval(() => setTime(fmt(tz)), 30000);
    return () => clearInterval(id);
  }, [tz]);
  return <time>{time}</time>;
};

const CopyEmail = ({ email }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-9 items-center rounded-full border border-rule px-3.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-ink hover:text-ink"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
};

const Contact = () => {
  const p = data.profile;
  return (
    <section id="contact" aria-labelledby="contact-title" className="pt-24">
      <SectionHeading n="04" id="contact-title" title="Contact" />
      <div data-reveal>
        <p className="mt-10 max-w-[13ch] font-display text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.95] tracking-[-0.01em]">
          Have a role or a project in <em className="text-accent">mind?</em>
        </p>
        <p className="mt-6 max-w-prose text-ink-2">
          I'm open to remote frontend and product-engineering roles. Email is the quickest way to
          reach me, and I'm happy to share code samples or walk through any project above.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${p.email}`}
            className="link break-all font-display text-[clamp(1.7rem,4.2vw,2.5rem)] leading-tight text-ink"
          >
            {p.email}
          </a>
          <CopyEmail email={p.email} />
        </div>
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-rule pt-6 sm:grid-cols-3">
        <div>
          <dt className="kicker">Local time</dt>
          <dd className="mt-1.5 font-mono text-[0.9rem]">
            <LocalTime tz={p.timezone} /> <span className="text-ink-3">{p.utcOffset}</span>
          </dd>
        </div>
        <div>
          <dt className="kicker">Based in</dt>
          <dd className="mt-1.5">{p.location}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="kicker">Elsewhere</dt>
          <dd className="mt-1.5 flex gap-5">
            {p.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="group link">
                {s.label} <Arrow />
              </a>
            ))}
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default Contact;
