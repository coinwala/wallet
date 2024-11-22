import Appbar from "@/components/Appbar/Appbar";
import LinkWallet from "@/components/LinkWallet";
import React from "react";

export default function page() {
  return (
    <div>
      <section className="h-[100vh] flex flex-col items-center justify-center">
        <Appbar />
        <LinkWallet />
      </section>
    </div>
  );
}
