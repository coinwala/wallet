"use client";
import { CircleDot } from "lucide-react";
import React, { startTransition } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { signInAction } from "@/lib/signInAction";

export default function page() {
  const handleSubmit = () => {
    startTransition(() => {
      signInAction();
    });
  };
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black dark:bg-gray-950">
      <div className="mt-[-60px] flex w-full max-w-screen-xl items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center justify-center h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full bg-gray-100">
          <Image
            alt="logo"
            height={50}
            width={50}
            src={"/icons/logo.png"}
            className="object-contain"
          />
        </div>

        <div className="flex items-center justify-center h-[50px] w-[50px] sm:h-[60px] sm:w-[60px]">
          <DotLottieReact src="./lootie/DotAnimation.json" loop autoplay />
        </div>

        <div className="flex items-center justify-center h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full bg-gray-100">
          <Image
            alt="Google logo"
            height={40}
            width={40}
            src={"/assets/images/images/GoogleLogo.png"}
            className="object-contain p-1"
          />
        </div>
      </div>
    </div>
  );
}
