import React from "react";
import Intro, { MobileBar, SECTIONS } from "../components/Intro";
import Highlights from "../components/sections/Highlights";
import Work from "../components/sections/Work";
import Experience from "../components/sections/Experience";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";
import useReveal from "../hooks/useReveal";
import useActiveSection from "../hooks/useActiveSection";

const IDS = SECTIONS.map((s) => s.id);

export const SkipLink = () => (
  <a
    href="#content"
    className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
  >
    Skip to content
  </a>
);

export const Footer = () => (
  <footer className="mt-28 flex flex-col gap-2 border-t border-rule pb-12 pt-6 font-mono text-[0.72rem] text-ink-3 sm:flex-row sm:justify-between">
    <p>© {new Date().getFullYear()} Bisoj Biswakarma. Designed and built in Kathmandu.</p>
    <p>Set in Instrument Serif, Schibsted Grotesk and IBM Plex Mono.</p>
  </footer>
);

const Landing = () => {
  useReveal();
  const active = useActiveSection(IDS);

  return (
    <>
      <SkipLink />
      <MobileBar />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:px-12">
        <Intro active={active} />
        <main id="content" tabIndex={-1} className="pt-16 outline-none lg:pt-14">
          <Highlights />
          <Work />
          <Experience />
          <About />
          <Contact />
          <Footer />
        </main>
      </div>
    </>
  );
};

export default Landing;
