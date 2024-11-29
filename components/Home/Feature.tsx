"use client";
import React from "react";
import WalletIntro from "./WalletIntro";

const FeatureSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className=" mt-10 max-w-[100vw] mx-auto px-4">
        <div className="relative w-full z-10">
          <WalletIntro />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
