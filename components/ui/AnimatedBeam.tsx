"use client";

import React from "react";
import { motion } from "framer-motion";

export const AnimatedBeam: React.FC = () => {
  return (
    <svg
      width="62"
      height="105"
      viewBox="0 0 62 105"
      fill="none"
      className="left-1/2 -translate-x-16 top-10"
    >
      <defs>
        <linearGradient id="beamGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#00f2fe" />
        </linearGradient>
      </defs>
      <path
        d="M1.00001 0L1 57.5C1 64.1274 6.37258 69.5 13 69.5H49C55.6274 69.5 61 74.8726 61 81.5L61 105"
        stroke="#333333"
        strokeWidth="1.5"
        className="opacity-20"
      />
      <motion.path
        d="M1.00001 0L1 57.5C1 64.1274 6.37258 69.5 13 69.5H49C55.6274 69.5 61 74.8726 61 81.5L61 105"
        stroke="url(#beamGradient1)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1],
          opacity: [0, 1, 0.8, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.4, 0.6, 1],
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 4,
          delay: 1,
        }}
      />
    </svg>
  );
};
