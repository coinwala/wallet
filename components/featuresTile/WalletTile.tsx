"use client";
import React, { useTransition } from "react";
import { AnimatedBeam } from "../ui/AnimatedBeam";
import { AnimatedBeam2 } from "../ui/AnimatedBeam2";
import { FcGoogle } from "react-icons/fc";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { signInAction } from "@/lib/signInAction";

export default function WalletTile() {
  const [isPending, startTransition] = useTransition();
  const handleSubmit = () => {
    startTransition(() => {
      signInAction();
    });
  };
  return (
    <div className="flex flex-col  gap-4 p-8 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col  justify-center gap-6">
          <div>
            <span className="max-w-fit">
              <span className="py-2 px-2 max-w-fit flex items-center rounded-lg border border-[rgba(255,255,255,0.10)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]group backdrop-blur-md transition-all duration-300 ">
                <p className="text-xl font-semibold text-white flex items-center gap-2">
                  <Wallet className="h-5 w-5 " />
                  WAllET
                </p>
              </span>
            </span>
          </div>
          <div>
            <p className="text-3xl font-semibold text-white">
              Create a{" "}
              <span className="inset-0 bg-gradient-to-r from-blue-400 via-blue-700 to-blue-400 bg-clip-text text-transparent">
                self-custodial wallet
              </span>{" "}
              using just your existing Google account.
            </p>

            <p className="text-gray-400 text-lg mt-4">
              Experience true ownership with CoinWala Wallet—log in effortlessly
              with your Google account while retaining full control of your
              wallet, NFTs, and keys. Your assets, your freedom.
            </p>
          </div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button size="lg" variant="outline" className="text-black">
              Learn More
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isPending}
              className="
        flex items-center gap-3 
        px-8 py-3
        text-base 
        bg-white/10 
        backdrop-blur-sm 
        border border-white/20 
        hover:bg-white/20 
        transition-all duration-300 
        group"
            >
              <span className="transition-all pr-1 duration-300 group-hover:mr-2">
                {isPending ? "Logging in..." : "Get Started with "}
              </span>
              <FcGoogle className="text-xl transition-transform group-hover:scale-110" />
            </Button>
          </motion.div>
        </div>
        <div>
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
        </div>
      </div>
    </div>
  );
}
