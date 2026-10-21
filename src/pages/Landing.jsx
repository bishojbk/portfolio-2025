import React, { useEffect, useState } from "react";
import data from "../json/data.json";
import LiveChecks from "../components/Proof";
import Work from "../components/Work";
import AiWork from "../components/AiWork";
import { Education, Experience, Toolkit } from "../components/Career";
import ThemeToggle from "../components/ThemeToggle";

const ext = { target: "_blank", rel: "noopener noreferrer" };
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

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
    <button type="button" className="btn" onClick={copy}>
      <span aria-live="polite">{done ? "Copied ✓" : "Copy email"}</span>
    </button>
  );
};

const SectionHead = ({ id, kicker, title, children }) => (
  <div className="max-w-text">
    <p className="kicker">{kicker}</p>
    <h2 id={id} className="mt-2 text-[1.9rem] font-bold sm:text-[2.2rem]">
      {title}
    </h2>
    {children && <p className="mt-2 text-muted">{children}</p>}
  </div>
);

const Landing = () => {
  const p = data.profile;
  const [gh, li] = p.links;
  return (
    <>
      <a
        href="#content"
        className="sr-only rounded-md bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      {/* Sticky on wider screens only, so it never eats a phone's screen. */}
      <header className="z-40 border-b border-line/80 bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70 md:sticky md:top-0">
        <div className="mx-auto flex max-w-wide flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 text-[0.95rem] sm:px-8">
          <a href="/" className="flex items-center gap-2.5 font-bold text-fg no-underline">
            <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-fg text-[0.95rem] text-bg">
              B
            </span>
            {p.name}
          </a>
          <nav aria-label="Main" className="order-last w-full md:order-none md:ml-auto md:w-auto">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <li><a className="font-semibold text-fg no-underline hover:text-link" href="#work">Work</a></li>
              <li><a className="font-semibold text-fg no-underline hover:text-link" href="#ai">AI</a></li>
              <li><a className="font-semibold text-fg no-underline hover:text-link" href="#experience">Experience</a></li>
              <li><a className="font-semibold text-fg no-underline hover:text-link" href="#contact">Contact</a></li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="content" tabIndex={-1} className="mx-auto max-w-wide px-5 outline-none sm:px-8">
        {/* Hero */}
        <section aria-labelledby="intro" className="grid grid-cols-1 items-center gap-10 pb-20 pt-12 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_27rem]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-good/30 bg-good/10 px-3 py-1 text-[0.85rem] font-semibold text-good">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-good" />
              Open to remote roles
            </p>
            <h1 id="intro" className="mt-5 text-[2.5rem] font-extrabold leading-[1.08] tracking-[-0.01em] sm:text-[3.4rem]">
              Frontend engineer who makes React apps <span className="text-link">fast</span> and{" "}
              <span className="text-link">accessible</span>.
            </h1>
            <p className="mt-5 max-w-[36rem] text-[1.2rem] text-muted">
              I'm Bisoj, in Kathmandu. I architected AgencyHeight, the Next.js marketplace 3,000+ insurance agents use at
              Renegade Insurance, and I build with Claude Code every day.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="btn btn-primary px-5 py-2.5" href={`mailto:${p.email}`}>
                Email me
              </a>
              <a className="btn px-5 py-2.5" href="#work">
                See the work <span aria-hidden="true">↓</span>
              </a>
              <a className="btn px-5 py-2.5" href={p.resume} {...ext}>
                CV (PDF)
                <NewTab />
              </a>
            </div>
            <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[0.95rem]">
              <a href={gh.url} {...ext}>
                GitHub
                <NewTab />
              </a>
              <a href={li.url} {...ext}>
                LinkedIn
                <NewTab />
              </a>
            </p>
            <p className="mt-1 text-[0.95rem] text-muted">3+ years · React, Next.js, TypeScript</p>
          </div>
          <LiveChecks />
        </section>

        {/* Work */}
        <section id="work" aria-labelledby="work-title" className="pb-24">
          <SectionHead id="work-title" kicker="Selected work" title="Things I've built">
            Real recordings and screenshots. Open a card for the story, or try the tax calculator right here.
          </SectionHead>
          <div className="mt-8">
            <Work projects={data.projects} alsoBuilt={data.alsoBuilt} />
          </div>
        </section>

        {/* AI */}
        <section id="ai" aria-labelledby="ai-title" className="pb-24">
          <SectionHead id="ai-title" kicker="AI-assisted development" title="How I build with AI">
            Agents write a lot of my code. I set them up to follow the repo's rules, and I review what they ship.
          </SectionHead>
          <div className="mt-8">
            <AiWork />
          </div>
        </section>

        {/* Experience */}
        <section id="experience" aria-labelledby="exp-title" className="pb-24">
          <SectionHead id="exp-title" kicker="Career" title="Experience" />
          <div className="mt-10">
            <Experience items={data.experience} />
          </div>
          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Toolkit groups={data.toolkit} />
            <Education edu={data.education} resume={p.resume} />
          </div>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title" className="pb-20">
          <div className="surface-tint relative overflow-hidden p-6 sm:p-10">
            <p className="kicker">Contact</p>
            <h2 id="contact-title" className="mt-2 max-w-[30rem] text-[1.9rem] font-bold sm:text-[2.4rem]">
              Hiring a frontend engineer? Let's talk.
            </h2>
            <p className="mt-3 text-muted">
              Email is fastest. I'm in {p.location} ({p.utcOffset}), where it's <LocalTime tz={p.timezone} /> now.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a className="btn btn-primary px-5 py-2.5 text-[1.05rem]" href={`mailto:${p.email}`}>
                {p.email}
              </a>
              <CopyEmail email={p.email} />
              <a className="btn" href={li.url} {...ext}>
                LinkedIn <span aria-hidden="true">↗</span>
                <NewTab />
              </a>
              <a className="btn" href={gh.url} {...ext}>
                GitHub <span aria-hidden="true">↗</span>
                <NewTab />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-wide border-t border-line px-5 py-8 text-[0.9rem] text-muted sm:px-8">
        <p>
          Set in Atkinson Hyperlegible, a typeface the Braille Institute designed for low-vision readers. Built with Vite
          and React; the source is{" "}
          <a href="https://github.com/bishojbk/portfolio-2025" {...ext}>
            on GitHub
            <NewTab />
          </a>
          .
        </p>
      </footer>
    </>
  );
};

export default Landing;
