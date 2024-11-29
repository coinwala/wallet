"use client";
import React from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { AnimatedBeam } from "../ui/AnimatedBeam";
import { AnimatedBeam2 } from "../ui/AnimatedBeam2";
import {
  ArrowRightLeft,
  icons,
  Link,
  PlugZap,
  ShoppingBasket,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { World } from "../ui/globe";
import { globeConfig, sampleArcs } from "@/lib/GlobeConstant";
import { CardDemo } from "../AnimatedCard";

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
          height="1"
          fill="url(#beamGradient)"
        />
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

const FeatureCard = ({
  title,
  description,
  children,
  icon,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-8 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group"
  >
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
      }}
      className={`
    p-8 
    flex 
    items-center 
    justify-center 
    rounded-full 
    border 
    border-[rgba(255,255,255,0.10)] 
    
    shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]
    group
    backdrop-blur-md
    transition-all
    duration-300
     w-[30px]
    h-[30px] 
    aspect-square
   
  `}
    >
      <div className="h-6 w-6 flex justify-center text-center align-middle items-center">
        {icon}
      </div>
    </motion.div>
    <div className="h-[20rem] rounded-xl z-40 bg-radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)">
      <div className="p-8 overflow-hidden h-full">{children}</div>
    </div>
    <motion.h3
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-lg font-semibold text-white py-2"
    >
      {title}
    </motion.h3>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="text-sm font-normal text-neutral-400 max-w-full"
    >
      {description}
    </motion.div>
  </motion.div>
);

const FeatureShowcase = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <FeatureCard
          title="Access the world of crypto with just 2 clicks."
          description="Unlock your secure Dwalto wallet instantly and step into the future of finance."
          icon={<Wallet color="white" size={24} />}
        >
          <div>
            <Image
              src={"/assets/images/images/dashboard.png"}
              width={1500}
              height={1000}
              alt="hyperlink"
            />
          </div>
        </FeatureCard>
      </div>
      <FeatureCard
        title="Simplify Access to Your Solana App"
        description="Revolutionize onboarding—instant access to Solana with Google integration."
        icon={<PlugZap color="white" size={24} />}
      >
        <div className="flex flex-col items-center justify-center h-full ">
          <div className="ml-[65px]">
            <AnimatedBeam />
          </div>

          <div className="p-8 flex  items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group">
            <FcGoogle className="h-5 w-5 text-white" />
          </div>
          <div className="ml-[75px]">
            <AnimatedBeam2 />
          </div>
        </div>
      </FeatureCard>

      <FeatureCard
        title="Swap seamlessly"
        description="Experience lightning-fast swaps with unmatched low fees."
        icon={<ArrowRightLeft color="white" size={24} />}
      >
        <div className="flex  items-center justify-center h-full ">
          <CardDemo />
        </div>
      </FeatureCard>
      <FeatureCard
        title="Share Crypto, Simplified"
        description="Send money to anyone instantly with just a link."
        icon={<Link color="white" size={24} />}
      >
        <World data={sampleArcs} globeConfig={globeConfig} />
      </FeatureCard>
      <FeatureCard
        title="Invest Smarter with Curated Token Baskets"
        description="Unlock growth potential with expertly curated token baskets—designed to help you invest with confidence and ease."
        icon={<ShoppingBasket color="white" size={24} />}
      >
        <div className="flex  items-center justify-center h-full ">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter 
            bg-gradient-to-b from-white to-white/70 
            text-transparent bg-clip-text 
            mb-4 leading-tight"
          >
            Comming Soon
          </h1>
        </div>
      </FeatureCard>
    </div>
  );
};

const HeroImage = () => {
  return (
    <section className="relative max-w-[1300px] mx-auto px-4 md:mt-20 my-10">
      <div className="relative p-3 bg-black rounded-2xl overflow-hidden">
        <AnimatedBeamBorder />
        <div className="bg-black text-white py-16">
          <div className="container mx-auto">
            <FeatureShowcase />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroImage;
