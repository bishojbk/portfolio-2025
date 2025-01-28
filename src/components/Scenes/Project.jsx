import React from "react";
import data from "../../json/data.json";
import { motion } from "framer-motion";
import "./index.css";

const Project = ({ setSelectedPage }) => {
  const projectData = data.project;

  return (
    <div
      id="project"
      className="pt-[100px] lg:pb-20 flex flex-col w-full max-w-[1400px] mx-auto"
    >
      <motion.div
        className="flex flex-row items-center mb-5 sm:mb-6 md:mb-7 lg:mb-8 w-full"
        initial="hidden"
        whileInView={"visible"}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0, duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h2 className="text-nd-primary text-2xl sm:text-3xl md:text-4xl">
          Projects I have worked on
        </h2>
        <hr className="border-t border-nd-primary ml-5 flex-grow max-w-[450px]" />
      </motion.div>
      <motion.div onViewportEnter={() => setSelectedPage("project")}>
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-10 w-full mx-0 sm:mx-5">
          {projectData.map((value, index) => (
            <div
              className="relative h-[300px] lg:h-[1200px] max-w-full project-item group"
              key={index}
            >
              <motion.img
                src={value.imgUrl}
                alt={value.title}
                className="object-cover max-w-full project-image h-[280px] lg:!h-[1180px] rounded-[16px] shadow-md"
                initial="hidden"
                whileInView={"visible"}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.2 * index, duration: 0.7 }}
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0 },
                }}
                lazy={true}
              />

              <a
                href={value.linkWebsite}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[15px]"
              >
                <h3 className="text-white text-xl font-semibold">
                  {value.title}
                </h3>
              </a>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Project;
