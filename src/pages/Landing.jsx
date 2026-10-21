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
      <span aria-live="polite">{done ? "Copied" : "Copy address"}</span>
    </button>
  );
};

const SectionHead = ({ id, title, children }) => (
  <div className="max-w-[40rem]">
    <h2 id={id} className="text-[2.25rem] font-bold leading-[1.1] sm:text-[2.75rem]">
      {title}
    </h2>
    {children && <p className="mt-3 text-[1.15rem] text-muted">{children}</p>}
  </div>
);

const NAV = [
  ["#work", "Work"],
  ["#ai", "AI"],
  ["#experience", "Experience"],
  ["#contact", "Contact"],
];

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
      <header className="z-40 border-b border-line bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75 md:sticky md:top-0">
        <div className="mx-auto flex max-w-wide flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 text-[0.95rem] sm:px-8">
          <a href="/" className="font-bold text-fg no-underline">
            {p.name}
          </a>
          <nav aria-label="Main" className="order-last w-full md:order-none md:ml-auto md:w-auto">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a className="font-semibold text-fg no-underline hover:text-link hover:underline" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="content" tabIndex={-1} className="mx-auto max-w-wide px-5 outline-none sm:px-8">
        {/* Hero: the headline, and the page measuring itself. */}
        <section aria-labelledby="intro" className="grid grid-cols-1 items-center gap-12 pb-24 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_30rem]">
          <div>
            <p className="flex items-center gap-2 text-[0.95rem] font-semibold text-good">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-good" />
              Open to remote roles
            </p>
            <h1 id="intro" className="mt-5 text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.015em] sm:text-[3.75rem]">
              I build React apps that load fast and work for everyone.
            </h1>
            <p className="mt-6 max-w-[34rem] text-[1.2rem] text-muted">
              I'm Bisoj, a frontend engineer in Kathmandu. I architected AgencyHeight, the Next.js marketplace 3,000+
              insurance agents use at Renegade Insurance. Claude Code is my main coding tool.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn btn-primary px-5 py-2.5" href={`mailto:${p.email}`}>
                Email me
              </a>
              <a className="btn px-5 py-2.5" href="#work">
                See the work
              </a>
              <a className="btn px-5 py-2.5" href={p.resume} {...ext}>
                Open CV (PDF)
                <NewTab />
              </a>
            </div>
          </div>
          <LiveChecks />
        </section>

        <section id="work" aria-labelledby="work-title" className="pb-28">
          <SectionHead id="work-title" title="Things I've built">
            Real recordings and screenshots, captured from the live sites. Open any project for the full story, or run the
            tax calculator right on this page.
          </SectionHead>
          <div className="mt-12">
            <Work projects={data.projects} alsoBuilt={data.alsoBuilt} />
          </div>
        </section>

        <section id="ai" aria-labelledby="ai-title" className="pb-28">
          <SectionHead id="ai-title" title="How I build with AI">
            Agents write a lot of my code. I set them up to follow the repo's rules, and I review what they ship.
          </SectionHead>
          <div className="mt-12">
            <AiWork />
          </div>
        </section>

        <section id="experience" aria-labelledby="exp-title" className="pb-28">
          <SectionHead id="exp-title" title="Experience" />
          <div className="mt-12">
            <Experience items={data.experience} />
          </div>
          <div className="mt-20 grid grid-cols-1 gap-12 border-t border-line pt-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Toolkit groups={data.toolkit} />
            <Education edu={data.education} resume={p.resume} />
          </div>
        </section>

        {/* Contact: the address itself is the call to action. */}
        <section id="contact" aria-labelledby="contact-title" className="border-t border-line pb-24 pt-16">
          <h2 id="contact-title" className="text-[1.4rem] font-bold">
            Hiring a frontend engineer?
          </h2>
          <p className="mt-4">
            <a
              href={`mailto:${p.email}`}
              className="break-all text-[2.2rem] font-extrabold leading-tight tracking-[-0.01em] text-fg decoration-link decoration-[3px] underline-offset-[6px] hover:text-link sm:text-[3.5rem] lg:text-[4.25rem]"
            >
              {p.email}
            </a>
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CopyEmail email={p.email} />
            <a className="btn" href={li.url} {...ext}>
              LinkedIn
              <NewTab />
            </a>
            <a className="btn" href={gh.url} {...ext}>
              GitHub
              <NewTab />
            </a>
          </div>
          <p className="mt-6 text-muted">
            I'm in {p.location} ({p.utcOffset}). It's <LocalTime tz={p.timezone} /> here now.
          </p>
        </section>
      </main>

      <footer className="mx-auto max-w-wide border-t border-line px-5 py-8 text-[0.9rem] text-muted sm:px-8">
        <p className="max-w-[44rem]">
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
