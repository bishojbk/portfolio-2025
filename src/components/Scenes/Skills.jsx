import React from "react";
import { motion } from "framer-motion";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaWordpress } from "react-icons/fa";
import {
  FaClock,
  FaUsers,
  FaComments,
  FaLightbulb,
  FaBrain,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiFramer,
  SiWebflow,
  SiSass,
} from "react-icons/si";
import "./index.css";

const Skills = ({ setSelectedPage }) => {
  const skills = [
    { name: "HTML", icon: <FaHtml5 color="#b7b4d2" size={60} /> },
    { name: "CSS", icon: <FaCss3Alt color="#b7b4d2" size={60} /> },
    { name: "JavaScript", icon: <FaJs color="#b7b4d2" size={60} /> },
    { name: "React JS", icon: <FaReact color="#b7b4d2" size={60} /> },
    { name: "Next JS", icon: <SiNextdotjs color="#b7b4d2" size={60} /> },
    { name: "Tailwind", icon: <SiTailwindcss color="#b7b4d2" size={60} /> },
    { name: "SCSS", icon: <SiSass color="#b7b4d2" size={60} /> },
    { name: "TypeScript", icon: <SiTypescript color="#b7b4d2" size={60} /> },
    { name: "Framer", icon: <SiFramer color="#b7b4d2" size={60} /> },
    { name: "WordPress", icon: <FaWordpress color="#b7b4d2" size={60} /> },
    { name: "Webflow", icon: <SiWebflow color="#b7b4d2" size={60} /> },
  ];

  const softSkills = [
    { name: "Time Management", icon: <FaClock size={40} color="#b7b4d2" /> },
    { name: "Collaboration", icon: <FaUsers size={40} color="#b7b4d2" /> },
    { name: "Communication", icon: <FaComments size={40} color="#b7b4d2" /> },
    {
      name: "Problem-Solving",
      icon: <FaLightbulb size={40} color="#b7b4d2" />,
    },
    { name: "Critical Thinking", icon: <FaBrain size={40} color="#b7b4d2" /> },
  ];

  return (
    <div
      id="skills"
      className="pt-[100px] lg:pb-20 w-full max-w-[1000px] mx-auto "
      style={{ minHeight: "calc(100vh - 100px)" }}
    >
      <motion.div
        className="flex flex-row items-center mb-5 sm:mb-6 md:mb-7 lg:mb-8"
        initial="hidden"
        whileInView={"visible"}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0, duration: 0.7 }}
        variants={{
          hidden: { opacity: 0, y: 35 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h2 className="text-nd-primary text-2xl sm:text-3xl md:text-4xl">
          Skills
        </h2>
        <hr className="border-t border-nd-primary ml-5 flex-grow max-w-[300px]" />
      </motion.div>

      <motion.div
        onViewportEnter={() => setSelectedPage("skills")}
        className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-16"
      >
        <div className="shadow-xl px-8 py-12 rounded-lg">
          <h2 className="text-[#b7b4d2] text-2xl sm:text-3xl w-fit mx-auto p-3 rounded-lg shadow-md">
            Technical Skills
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3  gap-6 py-10">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className="text-center rounded py-2 px-6 flex flex-col items-center gap-y-2 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  style={{ textShadow: "0px 0px 10px rgba(255,255,255,0.6)" }}
                >
                  {skill.icon}
                </div>
                <span className="text-base text-[#b7b4d2] ">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="shadow-xl px-8 py-12 rounded-lg">
          <h2 className="text-[#b7b4d2] text-2xl sm:text-3xl w-fit mx-auto p-3 rounded-lg shadow-md">
            Soft Skills
          </h2>

          <div className="grid grid-cols-2 gap-6 py-10">
            {softSkills.map((skill, index) => (
              <motion.div
                key={index}
                className="text-center rounded py-2 px-6 flex flex-col items-center gap-y-2 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  style={{ textShadow: "0px 0px 10px rgba(255,255,255,0.6)" }}
                  className="text-[#b7b4d2] text-4xl"
                >
                  {skill.icon}
                </div>
                <span className="text-base text-[#b7b4d2]">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Skills;
