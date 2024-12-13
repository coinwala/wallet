"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NFTMetadata, TokenWithBalance } from "@/lib/types";
import TokenList from "./TokenList";
import ActivityTab from "./ActivityTab";
import NftTab from "./NftTab";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

interface AssetTabsProps {
  tokenBalances: TokenWithBalance[];
  publicKey: string | null;
}

export default function AssetTabs({
  tokenBalances,
  publicKey,
}: AssetTabsProps) {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedNft, setSelectedNft] = useState<NFTMetadata | null>(null);
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!publicKey) return;

      setLoading(true);
      setError("");

      try {
        const connection = new Connection(clusterApiUrl("devnet"));
        const walletPublicKey = new PublicKey(publicKey);
        const metaplex = new Metaplex(connection);

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          walletPublicKey,
          {
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
          }
        );

        console.log(tokenAccounts);
        const nftAccounts = tokenAccounts.value.filter((account) => {
          const tokenAmount = account.account.data.parsed.info.tokenAmount;
          return tokenAmount.decimals === 0 && tokenAmount.amount === "1";
        });

        const nftMetadata: NFTMetadata[] = await Promise.all(
          nftAccounts.map(async (nft) => {
            const mintAddress = new PublicKey(
              nft.account.data.parsed.info.mint
            );

            try {
              const metadata = await metaplex
                .nfts()
                .findByMint({ mintAddress });
              console.log(metadata);
              // Transform metadata to match our interface
              const transformedMetadata: NFTMetadata = {
                mint: mintAddress.toString(),
                name: metadata.name,
                model: metadata.model,
                uri: metadata.uri,
                symbol: metadata.symbol,
                image: metadata.json?.image,
                metadataAddress: metadata.metadataAddress.toString(),
                json: {
                  description: metadata.json?.description || "",
                  image: metadata.json?.image || "",
                  name: metadata.json?.name || "",
                  symbol: metadata.json?.symbol || "",
                },
                updateAuthorityAddress:
                  metadata.updateAuthorityAddress.toString(),
                sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
                primarySaleHappened: metadata.primarySaleHappened,
                isMutable: metadata.isMutable,
                tokenStandard: metadata.tokenStandard ?? null,
                collection: metadata.collection
                  ? {
                      address: metadata.collection.address.toString(),
                      verified: metadata.collection.verified,
                    }
                  : null,
                creators: metadata.creators?.map((creator) => ({
                  address: creator.address.toString(),
                  verified: creator.verified,
                  share: creator.share,
                })),
              };

              return transformedMetadata;
            } catch (e) {
              console.error(
                `Error fetching metadata for mint ${mintAddress}:`,
                e
              );

              return {
                mint: mintAddress.toString(),
                name: "Unknown",
                uri: "",
                symbol: "",
                image: undefined,
              };
            }
          })
        );

        setNfts(nftMetadata);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError("Failed to fetch NFTs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [publicKey]);
  return (
    <div className="rounded-b-lg px-5 pb-5 sm:px-8 sm:pb-8">
      <Tabs defaultValue="tokens" className="w-full">
        <TabsList>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger disabled={!nfts.length} value="nfts">
            NFTs
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <div className="w-full pt-5">
            <ActivityTab publicKey={publicKey} />
          </div>
        </TabsContent>
        <TabsContent value="nfts">
          <div className="w-full pt-5">
            <NftTab
              nfts={nfts}
              publicKey={publicKey}
              selectedNft={selectedNft}
              setSelectedNft={setSelectedNft}
              loading={loading}
              error={error}
            />
          </div>
        </TabsContent>
        <TabsContent value="tokens">
          <div className="w-full pt-5">
            <TokenList tokenBalances={tokenBalances} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
