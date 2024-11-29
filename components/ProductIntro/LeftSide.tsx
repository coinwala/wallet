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
  isMobile: boolean;
}

const LeftSide: React.FC<LeftSideProps> = ({ activeSection, isMobile }) => {
  return (
    <div className={`${isMobile ? "w-full" : "w-1/2"}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="h-full flex items-center justify-center p-4 md:p-8"
        >
          <WalletIntroLeft />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default LeftSide;
