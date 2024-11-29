import Image from "next/image";
import React from "react";

export default function WalletAdapterIntroLeft() {
  return (
    <div>
      <Image
        src={"/assets/images/images/adapter.png"}
        height={1500}
        width={1500}
        alt={"adapter"}
      />
    </div>
  );
}
