import React, { useEffect, useState } from "react";

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
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedNft(nft)}
          >
            {nft.image && (
              <Image
                src={nft.image}
                alt={nft.name}
                width={200}
                height={200}
                className="w-full object-cover rounded-lg"
              />
            )}
            <h3 className="font-semibold text-lg mb-2 mt-4">{nft.name}</h3>
            {nft.symbol && (
              <p className="text-sm text-gray-500 mb-2">Symbol: {nft.symbol}</p>
            )}
            <p className="text-xs text-gray-400 break-all">Mint: {nft.mint}</p>
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
