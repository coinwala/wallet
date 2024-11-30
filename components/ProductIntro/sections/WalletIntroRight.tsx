"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function WalletIntroRight() {
  return (
    <div className="flex justify-center items-center  md:w-1/2  bg-white text-black w-full">
      <div className="mx-auto px-4 py-12 flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-medium mb-6"
            >
              DWALTO WALLET
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Access your secure Dwalto wallet effortlessly
            </motion.h1>

            <motion.p
              className="text-xl text-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              set up or sign in instantly with just two clicks!
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button size="lg" variant="outline" className="text-black">
                Learn More
              </Button>
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800"
              >
                Continue via Google
                <motion.span
                  className="ml-2"
                  initial={{ x: -5 }}
                  animate={{ x: 0 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    repeatType: "reverse",
                  }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
