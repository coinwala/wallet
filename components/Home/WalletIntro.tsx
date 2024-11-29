import { useState, useRef, useEffect } from "react";
import LeftSide from "../ProductIntro/LeftSide";
import RightSide from "../ProductIntro/RightSide";
import { motion } from "framer-motion";

export default function WalletIntro() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef<(HTMLLIElement | null)[]>([]);

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
    <main>
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
      <div className="flex w-full min-h-screen ">
        <LeftSide activeSection={activeSection} />
        <RightSide
          sectionsRef={sectionsRef}
          setActiveSection={setActiveSection}
        />
      </div>
    </main>
  );
}
