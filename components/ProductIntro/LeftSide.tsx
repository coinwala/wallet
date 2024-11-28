import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import WalletIntroLeft from "./sections/WalletIntroLeft";
import WalletAdapterIntroLeft from "./sections/WalletAdapterIntroLeft";

interface LeftSideProps {
  activeSection: number;
}

const LeftSide: React.FC<LeftSideProps> = ({ activeSection }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldBeFixed, setShouldBeFixed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { top, bottom } = containerRef.current.getBoundingClientRect();
      const parentHeight =
        containerRef.current.parentElement?.offsetHeight || 0;

      const isWithinBounds = top <= 0 && bottom >= window.innerHeight;
      const hasNotReachedEnd =
        Math.abs(window.scrollY + window.innerHeight - parentHeight) > 10;

      setShouldBeFixed(isWithinBounds && hasNotReachedEnd);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]); // Add activeSection as a dependency

  console.log(activeSection);

  return (
    <div className="w-1/2" ref={containerRef}>
      <motion.div
        className={`h-screen ${
          shouldBeFixed ? "fixed top-0 left-0 w-1/2" : "relative w-full"
        }`}
        style={{ y: shouldBeFixed ? y : 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection} // Ensure key changes with activeSection
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="h-full flex items-center justify-center p-8"
          >
            {activeSection === 0 && <WalletIntroLeft />}
            {activeSection === 1 && <WalletAdapterIntroLeft />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LeftSide;
