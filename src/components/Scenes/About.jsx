import React from "react";
import data from "../../json/data.json";
import { motion } from "framer-motion";
import { Link } from "react-scroll";

const About = ({ setSelectedPage }) => {
  const tech = data.about[0].tech;
  return (
    <div
      id="about"
      className="pt-[100px] lg:pb-20 grid place-content-center w-full max-w-[1000px] mx-auto"
      style={{ minHeight: "calc(100vh - 100px)" }}
    >
      <motion.div
        className="flex flex-row items-center mb-5 sm:mb-6 md:mb-7 lg:mb-8"
        initial="hidden"
        whileInView={"visible"}
        viewport={{ once: true, amount: "all" }}
        transition={{ delay: 0, duration: 0.7 }}
        variants={{
          hidden: { opacity: 0, y: 35 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h2 className="text-nd-primary text-2xl sm:text-3xl md:text-4xl element">
          WHO AM I?
        </h2>
        <hr className="border-t border-nd-primary ml-5 flex-grow max-w-[450px]" />
      </motion.div>
      <motion.div onViewportEnter={() => setSelectedPage("about")}>
        <div className="flex flex-col gap-y-2 sm:gap-y-3 md:gap-y-4 flex-grow">
          <motion.p
            className="text-nd-white text-base sm:text-lg text-justify tracking-wide"
            initial="hidden"
            whileInView={"visible"}
            viewport={{ once: true, amount: "all" }}
            transition={{ delay: 0.3, duration: 0.7 }}
            variants={{
              hidden: { opacity: 0, y: 35 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Hello! I&apos;m a{" "}
            <span className="underline">software engineer</span> with 3+ years
            of building production web products with React, Next.js, TypeScript
            and Node.js. <br /> Today I work remotely for a US insurance
            company, where I architected the Next.js monorepo behind a
            marketplace used by more than 3,000 agents, set the engineering
            standards the team follows, and shipped an LLM feature on the
            OpenAI and Gemini APIs. Before that I built public-sector platforms
            in Nepal, including the national census portal. <br /> I care about
            performance, accessibility and owning features end to end, and I
            work AI-first: Claude Code is my main tool, and every line it writes
            gets reviewed.
          </motion.p>
          <motion.p
            className="text-nd-white text-base sm:text-lg text-justify tracking-wide"
            initial="hidden"
            whileInView={"visible"}
            viewport={{ once: true, amount: "all" }}
            transition={{ delay: 0.6, duration: 0.7 }}
            variants={{
              hidden: { opacity: 0, y: 35 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            I&apos;m open to job opportunities where I can contribute, learn,
            and grow. If you have a great opportunity that aligns with my skills
            and{" "}
            <Link
              className="text-nd-primary cursor-pointer underline"
              to={"experience"}
              smooth={true}
              duration={500}
              onClick={() => setSelectedPage("experience")}
            >
              experience
            </Link>{" "}
            don't hesitate to{" "}
            <Link
              className="text-nd-primary cursor-pointer underline tracking-wide"
              to={"contact"}
              smooth={true}
              duration={500}
              onClick={() => setSelectedPage("contact")}
            >
              contact me.
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
