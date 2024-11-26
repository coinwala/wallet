"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import WalletIntro from "./WalletIntro";

const FeatureSection = () => {
  const { scrollYProgress } = useScroll();

  const borderRadius = useTransform(scrollYProgress, [0, 0.2], [50, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section className="relative overflow-hidden">
      <div className="md:mt-20 mt-10 max-w-[1000px] mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center">
            <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-inner">
              Features
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-black/70 text-transparent bg-clip-text text-center mt-5">
            Key Features
          </h1>
          <p className="text-lg tracking-tighter text-black/70 text-center mt-5">
            Explore the Core Features of Our Tool!
          </p>
        </motion.div>

        {/* Parallax Container */}
        <motion.div
          className="my-10 w-full mx-auto"
          style={{
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          }}
        >
          <motion.div
            className="absolute w-full top-0 left-0 right-0 h-full bg-gradient-to-b from-blue-100 to-white opacity-20"
            style={{
              y: backgroundY,
            }}
          />
          <div className="relative w-full z-10">
            <WalletIntro />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
