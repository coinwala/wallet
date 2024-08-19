"use client";
import React, { useState, useEffect } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HyperLink } from "@/url";
import background from "../../public/assets/images/background.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Copy, QrCodeIcon } from "lucide-react";

interface HyperLinkData {
  keypair: {
    publicKey: PublicKey;
  };
}

const HyperLinkCard: React.FC = () => {
  const [hyperlink, setHyperlink] = useState<HyperLinkData | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [usdBalance, setUsdBalance] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [url, setUrl] = useState<URL>(new URL(window.location.href));
  console.log(url);

  useEffect(() => {
    const loadHyperLink = async (): Promise<void> => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const url = `${process.env.NEXT_PUBLIC_HYPERLINK_ORIGIN}#${hash}`;
        try {
          const hyperlinkInstance = await HyperLink.fromLink(url);
          setHyperlink(hyperlinkInstance);
          fetchBalance(hyperlinkInstance);
        } catch (err) {
          setError("Invalid HyperLink");
        }
      }
    };

    loadHyperLink();
  }, []);

  const fetchBalance = async (
    hyperlinkInstance: HyperLinkData
  ): Promise<void> => {
    try {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const balance = await connection.getBalance(
        hyperlinkInstance.keypair.publicKey
      );
      const solBalance = balance / LAMPORTS_PER_SOL;
      setBalance(solBalance);

      // Fetch SOL to USD conversion rate (mock API call)
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const data: { solana: { usd: number } } = await response.json();
      const solUsdPrice = data.solana.usd;
      setUsdBalance(solBalance * solUsdPrice);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Error fetching balance.");
    }
  };

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!hyperlink) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <p className="text-center">Loading HyperLink...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-center">
          This is ${usdBalance?.toFixed(2)} in crypto
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-thin flex items-center justify-center text-center">
            The link to page contains this value make sure you don't lose it!
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Badge className="text-lg p-2 px-4">{url.href}</Badge>
        </div>
        <div className="flex justify-center items-center gap-3">
          <div>
            <Button className="h-[80px]">
              <div className="flex flex-col items-center px-10 p-15">
                <span>
                  <Copy />
                </span>
                <span>Copy</span>
              </div>
            </Button>
          </div>
          <div>
            <Button className="h-[80px]">
              <div className="flex flex-col items-center px-10 p-15">
                <span>
                  <Bookmark />
                </span>
                <span>Bookmark</span>
              </div>
            </Button>
          </div>
          <div>
            <Button className="h-[80px]">
              <div className="flex flex-col items-center px-10 p-15">
                <span>
                  <QrCodeIcon />
                </span>
                <span>QR code</span>
              </div>
            </Button>
          </div>
        </div>
        {balance !== null && (
          <div
            className="rounded-xl shadow-lg p-6 flex flex-row justify-between"
            style={{ backgroundImage: `url(${background.src})` }}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col items-start">
                <div className="mt-10">
                  <h1 className=" text-[4rem] leading-none font-bold">Your</h1>
                  <h1 className=" text-[4rem] leading-none font-bold">
                    Balance
                  </h1>
                </div>
                <div className="mt-10">
                  <Badge className="text-lg">{url.hash}</Badge>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className="text-center mt-[5rem]">
                  <p className="text-pink-400">{balance.toFixed(4)} SOL</p>
                  {usdBalance !== null && (
                    <h1 className="text-4xl">${usdBalance.toFixed(2)}</h1>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-[5rem]">
                <p className="text-gray-400 text-xs">POWERED BY Hyperlink</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HyperLinkCard;