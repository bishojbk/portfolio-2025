import React, { useEffect, useState } from "react";
import data from "../json/data.json";
import Proof from "../components/Proof";
import Project from "../components/Project";
import ThemeToggle from "../components/ThemeToggle";

const ext = { target: "_blank", rel: "noopener noreferrer" };

const LocalTime = ({ tz }) => {
  const fmt = () => new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 30000);
    return () => clearInterval(id);
  }, []);
  return <time className="tnum">{t}</time>;
};

const CopyEmail = ({ email }) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (e) {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <button type="button" className="btn py-1 text-[0.9rem]" onClick={copy}>
      <span aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </button>
  );
};

const Landing = () => {
  const p = data.profile;
  return (
    <>
      <a
        href="#content"
        className="sr-only rounded-md bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-wide px-5 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 py-5 text-[0.95rem]">
          <a href="/" className="font-bold text-fg no-underline">
            {p.name}
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <li><a href="#work">Work</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><ThemeToggle /></li>
            </ul>
          </nav>
        </header>

        <main id="content" tabIndex={-1} className="outline-none">
          <section aria-labelledby="intro" className="max-w-text pb-14 pt-10 sm:pt-16">
            <h1 id="intro" className="text-[2.1rem] font-bold sm:text-[2.6rem]">
              I'm Bisoj, a frontend engineer in Kathmandu.
            </h1>
            <p className="mt-5 text-[1.2rem]">
              I build web apps with React, Next.js and TypeScript. I care most about how fast a page loads and
              whether everyone can use it, so this page measures both for you, just below.
            </p>
            <p className="mt-4">
              Right now I'm a Software Development Engineer at Renegade Insurance, a US company, where I
              architected AgencyHeight, the marketplace about 3,000 of its insurance agents use.
            </p>
            <p className="mt-4">
              I'm open to remote roles. Email me at <a href={`mailto:${p.email}`}>{p.email}</a>, or see my{" "}
              <a href={p.resume} {...ext}>CV (PDF)</a>, <a href={p.links[0].url} {...ext}>GitHub</a> and{" "}
              <a href={p.links[1].url} {...ext}>LinkedIn</a>.
            </p>
          </section>

          <section aria-labelledby="proof-title" className="pb-16">
            <h2 id="proof-title" className="text-[1.6rem] font-bold">
              This page, measured in your browser
            </h2>
            <p className="mt-2 max-w-text text-muted">Nothing here is hard-coded. The numbers come from your visit, right now.</p>
            <div className="mt-6">
              <Proof />
            </div>
          </section>

          <section id="work" aria-labelledby="work-title" className="pb-8">
            <h2 id="work-title" className="text-[1.6rem] font-bold">
              Work
            </h2>
            <p className="mt-2 max-w-text text-muted">
              Every recording and screenshot is of the real thing, with the date I captured it. The calculator you can use
              right here.
            </p>
            <div className="mt-8 space-y-14">
              {data.projects.map((proj) => (
                <Project key={proj.id} p={proj} />
              ))}
            </div>
            <div className="mt-14 max-w-text border-t border-line pt-8">
              <h3 className="text-[1.2rem] font-bold">Also built</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                {data.alsoBuilt.map((a) => (
                  <li key={a.url}>
                    <a href={a.url} {...ext}>{a.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="experience" aria-labelledby="exp-title" className="max-w-text pb-16 pt-8">
            <h2 id="exp-title" className="text-[1.6rem] font-bold">
              Experience
            </h2>
            <ol className="mt-5">
              {data.experience.map((e) => (
                <li key={e.company} className="grid gap-x-6 gap-y-1 border-t border-line py-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                  <span className="text-muted tnum">{e.dates}</span>
                  <span>
                    <strong>{e.role}</strong>, {e.company}
                    <span className="block text-muted">{e.note}</span>
                  </span>
                </li>
              ))}
              <li className="grid gap-x-6 gap-y-1 border-t border-line py-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                <span className="text-muted">Education</span>
                <span>{data.education}</span>
              </li>
            </ol>
            <p className="mt-4">
              <a href={p.resume} {...ext}>Full CV (PDF)</a>
            </p>
          </section>

          <section id="contact" aria-labelledby="contact-title" className="max-w-text pb-16">
            <h2 id="contact-title" className="text-[1.6rem] font-bold">
              Contact
            </h2>
            <p className="mt-3 flex flex-wrap items-center gap-3">
              <span>
                Email is best: <a href={`mailto:${p.email}`}>{p.email}</a>
              </span>
              <CopyEmail email={p.email} />
            </p>
            <p className="mt-3">
              I'm in {p.location} ({p.utcOffset}). It's <LocalTime tz={p.timezone} /> here now.
            </p>
            <p className="mt-3">
              Elsewhere: <a href={p.links[0].url} {...ext}>GitHub</a> · <a href={p.links[1].url} {...ext}>LinkedIn</a>
            </p>
          </section>
        </main>

        <footer className="max-w-text border-t border-line py-8 text-[0.95rem] text-muted">
          <p>
            Set in Atkinson Hyperlegible, a typeface the Braille Institute designed for readers with low vision. Built
            with Vite and React; the source is{" "}
            <a href="https://github.com/bishojbk/portfolio-2025" {...ext}>on GitHub</a>.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Landing;
