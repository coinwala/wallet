import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import WalletIntroRight from "../ProductIntro/sections/WalletIntroRight";
import WalletIntroLeft from "../ProductIntro/sections/WalletIntroLeft";
import WalletAdapterIntroLeft from "../ProductIntro/sections/WalletAdapterIntroLeft";
import WalletAdapterIntroRight from "../ProductIntro/sections/WalletAdapterIntroRight";

export default function WalletIntro() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(Number(entry.target.id));
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <main className="overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="px-4 md:px-0"
      >
        <div className="flex justify-center">
          <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-inner">
            Features
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-black/70 text-transparent bg-clip-text text-center mt-5">
          Key Features
        </h1>
        <p className="text-base md:text-lg tracking-tighter text-black/70 text-center mt-5">
          Explore the Core Features of Our Tool!
        </p>
      </motion.div>
      <div
        className={`flex flex-col md:flex-row w-full min-h-[50vh] mt-10 ${
          isMobile ? "mt-8" : ""
        }`}
      >
        <WalletIntroLeft />
        <WalletIntroRight />
      </div>
      <div
        className={`flex flex-col md:flex-row w-full min-h-screen ${
          isMobile ? "mt-8" : ""
        }`}
      >
        <WalletAdapterIntroLeft />
        <WalletAdapterIntroRight />
      </div>
    </main>
  );
}
