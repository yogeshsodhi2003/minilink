import React from "react";
import { motion } from "motion/react";

const Loading = ({ text = "Loading..." }) => {
  return (
    <motion.div
      className="absolute top-0 left-0 z-11 min-h-screen w-full flex flex-col bg-black/60 justify-center items-center  text-[#ff2969]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="rounded-full h-16 w-16 border-t-4 border-[#ff2969] border-opacity-80 mb-4"
        animate={{
          rotate: [0, 360],
          transition: {
            repeat: Infinity,
            duration: 1,
            ease: "linear", // ✅ Valid type
          },
        }}
      />

      <motion.p
        className="text-lg font-semibold"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.5,
          ease: "easeOut", // ✅ Valid type
        }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

export default Loading;
