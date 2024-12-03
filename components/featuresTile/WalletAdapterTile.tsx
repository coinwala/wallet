import { Unplug } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function WalletAdapterTile() {
  return (
    <div className="flex flex-col  gap-4 p-8 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-6">
          <div>
            <span className="max-w-fit">
              <span className="py-2 px-2 max-w-fit flex items-center rounded-lg border border-[rgba(255,255,255,0.10)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]group backdrop-blur-md transition-all duration-300 ">
                <p className="text-xl font-semibold text-white flex items-center gap-2">
                  <Unplug />
                  <span className="items-center">WALLET ADAPTER</span>
                </p>
              </span>
            </span>
          </div>

          <div>
            <Image
              src={"/assets/images/images/adapter.png"}
              height={1200}
              width={1200}
              alt={"adapter"}
            />
          </div>
        </div>
        <div className=" flex flex-col  justify-center">
          <p className="text-3xl font-semibold text-white">
            Connect your wallet with
            <span className="inset-0 bg-gradient-to-r from-[#9945FF]  to-[#14F195] bg-clip-text text-transparent">
              {" Solana apps "}
            </span>
            with just two clicks.
          </p>
          <p className="text-gray-400 text-lg mt-4">
            Experience true ownership with CoinWala Wallet—log in effortlessly
            with your Google account while retaining full control of your
            wallet, NFTs, and keys. Your assets, your freedom.
          </p>
        </div>
      </div>
    </div>
  );
}
