"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export default function WalletAdapterIntroRight() {
  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block  px-4 py-2 bg-gray-100 rounded-full text-sm font-medium mb-6"
        >
          <div className="flex gap-1">
            <Link className="w-6 h-6" />
            <span className="flex justify-center items-center text-center">
              DEWLTO WALLET ADAPTER
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Making Solana apps consumer-ready
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-black/80 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Let your users login with just a Google account and start signing
          transactions.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            variant="outline"
            className="text-black border-black hover:bg-black/10"
          >
            Learn More
          </Button>
          <Button size="lg" className="bg-black text-white hover:bg-black/90">
            Integrate Now
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
      </div>
    </div>
  );
}
