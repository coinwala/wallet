"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const AnimatedBeamBorder = () => {
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
      <svg
        width="100%"
        height="4"
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
        className="absolute top-0"
      >
        {/* Traveling Beam */}
        <motion.rect
          initial={{ x: -10 }}
          animate={{ x: 110 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          x="-10"
          y="0"
          width="20"
          height="4"
          fill="url(#beamGradient)"
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(100,200,255,0)" />
            <stop offset="50%" stopColor="rgba(100,200,255,0.8)" />
            <stop offset="100%" stopColor="rgba(100,200,255,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const HeroImage = () => {
  return (
    <section className="relative max-w-[1300px] mx-auto px-4 md:mt-20 my-10">
      <div className="relative p-3 bg-black rounded-2xl overflow-hidden">
        <AnimatedBeamBorder />
        <Image
          src="/assets/images/images/dashboard.png"
          width={1400}
          height={800}
          alt="hero-image"
          className="drop-shadow-xl rounded-lg"
        />
      </div>
    </section>
  );
};

export default HeroImage;
