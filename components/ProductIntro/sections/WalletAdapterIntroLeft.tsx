import Image from "next/image";
import React from "react";

export default function WalletAdapterIntroLeft() {
  return (
    <div className="w-full md:w-1/2 flex justify-center items-center p-8 ">
      <Image
        src={"/assets/images/images/adapter.png"}
        height={1700}
        width={1700}
        alt={"adapter"}
      />
    </div>
  );
}
