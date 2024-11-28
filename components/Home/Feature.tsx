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
      <div className=" mt-10 max-w-[100vw] mx-auto px-4">
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

        <div className="relative w-full z-10">
          <WalletIntro />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
