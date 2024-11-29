import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import WalletIntroRight from "./sections/WalletIntroRight";
import WalletAdapterIntroRight from "./sections/WalletAdapterIntroRight";

interface RightSideProps {
  sectionsRef: React.MutableRefObject<(HTMLLIElement | null)[]>;
  setActiveSection: (index: number) => void;
}

const items = [
  { id: 0, Comp: <WalletIntroRight /> },
  { id: 1, Comp: <WalletAdapterIntroRight /> },
];

const RightSide: React.FC<RightSideProps> = ({
  sectionsRef,
  setActiveSection,
}) => {
  useEffect(() => {
    const observers = items.map((item, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(item.id);
            }
          });
        },
        {
          threshold: 0.5, // Trigger when 50% of the section is visible
          root: null, // Use the viewport
        }
      );

      if (sectionsRef.current[index]) {
        observer.observe(sectionsRef.current[index]!);
      }

      return observer;
    });

    // Cleanup observers
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [setActiveSection]);

  return (
    <div className="w-1/2 ml-auto overflow-y-auto">
      <ul className="space-y-96 pb-[300px]">
        {items.map((item) => (
          <motion.li
            key={item.id}
            id={item.id.toString()}
            ref={(el) => {
              if (el) sectionsRef.current[item.id] = el;
            }}
            className="h-screen flex items-center justify-center"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: false, amount: 0.8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {item.Comp}
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default RightSide;
