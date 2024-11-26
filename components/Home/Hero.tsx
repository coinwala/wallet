"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { CardDemo } from "../AnimatedCard";
import { FaGoogle } from "react-icons/fa6";
import { signInAction } from "@/lib/signInAction";
import AnimatedGridSvg from "../ui/beamBG";

export default function Hero() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(() => {
      signInAction();
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimatedGridSvg />
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-[600px] lg:max-w-[900px] mx-auto text-center">
          <div className="mb-8">
            <CardDemo />
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter 
            bg-gradient-to-b from-white to-white/70 
            text-transparent bg-clip-text 
            mb-4 leading-tight"
          >
            Experience the Future of Crypto Today
          </h1>

          <p
            className="text-lg md:text-xl tracking-tight 
            text-white/80 
            max-w-[700px] mx-auto mb-8"
          >
            Effortlessly create a wallet using just your Google Account. Secure,
            simple, and instant access to the crypto world.
          </p>

          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="
                flex items-center gap-3 
                px-8 py-6 
                text-base 
                bg-white/10 
                backdrop-blur-sm 
                border border-white/20 
                hover:bg-white/20 
                transition-all duration-300 
                group"
            >
              <span className="transition-all duration-300 group-hover:mr-2">
                {isPending ? "Logging in..." : "Login with"}
              </span>
              <FaGoogle className="text-xl transition-transform group-hover:scale-110" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
