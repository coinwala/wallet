import React from "react";
import Hero from "./Hero";
import HeroImage from "./HeroImage";
import Feature from "./Feature";
import DocsShowcase from "./DocsShowcase";
import CallToAction from "./CallToAction";

export default function Home() {
  return (
    <div className="relative">
      <div className="relative z-10">
        <Hero />
      </div>
      <div className="-mt-10 md:-mt-30 lg:-mt-[180px] relative z-10">
        <HeroImage />
      </div>
      <div className="relative z-20">
        <Feature />
        <DocsShowcase />
        <CallToAction />
      </div>
    </div>
  );
}
