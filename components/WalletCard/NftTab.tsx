import React from "react";
import Image from "next/image";
import { NFTMetadata } from "@/lib/types";
import MetadataDialog from "./MetadataDialog";

interface NftTabProps {
  nfts: NFTMetadata[];
  publicKey: string | null;
  selectedNft: NFTMetadata | null;
  setSelectedNft: (nft: NFTMetadata | null) => void;
  loading: boolean;
  error: string;
}

export default function NftTab({
  publicKey,
  nfts,
  selectedNft,
  setSelectedNft,
  loading,
  error,
}: NftTabProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!publicKey) {
    return (
      <div className="p-4 text-gray-500">
        Please connect your wallet to view NFTs
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="p-4 text-gray-500">No NFTs found in this wallet</div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div
            key={nft.mint}
            className="group border border-gray-400 shadow-lg relative overflow-hidden rounded-xl cursor-pointer hover:shadow-md transition-shadow hover:border-purple-400"
            onClick={() => setSelectedNft(nft)}
          >
            <div className="absolute inset-0 bg-gradient-to-br  from-purple-400 to-blue-500 rounded-xl transform transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-[2px] bg-white bg-opacity-90 rounded-xl transition-all duration-300 group-hover:inset-0.5" />
            <div className="relative bg-white bg-opacity-90 rounded-xl p-6 shadow-lg transform transition-all duration-300 group-hover:scale-[1.02]">
              {nft.image && (
                <div className="relative w-full pb-[100%] mb-4 overflow-hidden rounded-xl  shadow-md">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              )}
              <h3 className="font-bold text-xl mb-2 text-gray-500">
                {nft.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {selectedNft && (
        <MetadataDialog
          nft={selectedNft}
          isOpen={!!selectedNft}
          onClose={() => setSelectedNft(null)}
        />
      )}
    </div>
  );
}
