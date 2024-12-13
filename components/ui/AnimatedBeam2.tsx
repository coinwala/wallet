"use client";

import React from "react";
import { motion } from "framer-motion";

export const AnimatedBeam2: React.FC = () => {
  return (
    <svg
      width="128"
      height="69"
      viewBox="0 0 128 69"
      fill="none"
      className=" left-1/2 translate-x-4 -bottom-2"
    >
      <defs>
        <linearGradient id="beamGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#00f2fe" />
        </linearGradient>
      </defs>
      <path
        d="M1.00002 0.5L1.00001 29.5862C1 36.2136 6.37259 41.5862 13 41.5862H115C121.627 41.5862 127 46.9588 127 53.5862L127 68.5"
        stroke="#333333"
        strokeWidth="1.5"
        className="opacity-20"
      />
      <motion.path
        d="M1.00002 0.5L1.00001 29.5862C1 36.2136 6.37259 41.5862 13 41.5862H115C121.627 41.5862 127 46.9588 127 53.5862L127 68.5"
        stroke="url(#beamGradient2)"
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
          delay: 4,
        }}
      />
    </svg>
  );
};
