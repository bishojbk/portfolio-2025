import React from "react";
import data from "../../json/data.json";
import { motion } from "framer-motion";

const Education = ({ setSelectedPage }) => {
  const education = data.education;

  return (
    <div
      id="education"
      className="lg:pb-20 grid place-content-center w-full max-w-[50rem] mx-auto"
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
          Education
        </h2>
        <hr className="border-t border-nd-primary ml-5 flex-grow max-w-[300px]" />
      </motion.div>

      <motion.div
        onViewportEnter={() => setSelectedPage("education")}
        className="space-y-6"
      >
        {education.map((value, index) => (
          <div className="flex gap-3 mx-3 sm:mx-4 md:mx-5" key={index}>
            <div className="flex flex-col gap-y-1">
              <motion.h1
                className="text-nd-white text-lg sm:text-xl"
                initial="hidden"
                whileInView={"visible"}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0, duration: 0.7 }}
                variants={{
                  hidden: { opacity: 0, y: 35 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {value.title} - {value.academic}
              </motion.h1>

              <motion.span
                className="text-sm text-nd-third"
                initial="hidden"
                whileInView={"visible"}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0, duration: 0.7 }}
                variants={{
                  hidden: { opacity: 0, y: 35 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {value.college}
              </motion.span>
              <motion.span
                className="text-sm text-nd-third"
                initial="hidden"
                whileInView={"visible"}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0, duration: 0.7 }}
                variants={{
                  hidden: { opacity: 0, y: 35 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                Year: {value.year}
              </motion.span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Education;
