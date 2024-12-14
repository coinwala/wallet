"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowUpDown, Check } from "lucide-react";
import TokenInput from "./TokenInput";
import SwapDetails from "./SwapDetails";
import { SwapRouteResponse, Token, TokenWithBalance } from "@/lib/types";
import { useEffect, useState } from "react";
import fetch from "cross-fetch";

interface TokenSwapProps {
  tokenBalances: TokenWithBalance[];
}

export default function TokenSwap({ tokenBalances }: TokenSwapProps) {
  const [selectedToken, setSelectedToken] = useState<
    TokenWithBalance | undefined
  >(undefined);
  const [tokens, setTokens] = useState<Token[] | null>();
  const [inputSelectedToken, setInputSelectedToken] = useState("SOL");
  const [outputSelectedToken, setOutputSelectedToken] = useState("USDC");
  const [loading, setLoading] = useState(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");
  const [inputToken, setInputToken] = useState<TokenWithBalance | undefined>();
  const [outputToken, setOutputToken] = useState<Token | undefined>();
  const [quote, setQuote] = useState<SwapRouteResponse | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://tokens.jup.ag/tokens?tags=verified"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tokens");
        }
        const data = await response.json();
        setTokens(data);
        console.log("data", data);
      } catch (err) {
        console.error("Error fetching tokens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);
  useEffect(() => {
    const inputToken = tokenBalances.find(
      (token) => token.symbol === inputSelectedToken
    );
    setSelectedToken(inputToken);

    const outputToken = tokens?.find(
      (token) => token.symbol === outputSelectedToken
    );
    console.log("outputToken", outputToken?.address);
    setInputToken(inputToken);
    setOutputToken(outputToken);
    fetchSwapQuote();
  }, [inputSelectedToken, outputSelectedToken, inputAmount]);
  const fetchSwapQuote = async () => {
    if (!selectedToken) {
      return;
    }
    const inputAmt = parseFloat(String(inputAmount));
    if (isNaN(inputAmt) || inputAmt <= 0) {
      return;
    }
    const lamports = Math.round(inputAmt * 1_000_000_000);
    try {
      const quoteResponse = await (
        await fetch(
          `  https://quote-api.jup.ag/v6/quote?inputMint=${inputToken?.mint}&outputMint=${outputToken?.address}&amount=${lamports}&slippageBps=50`
        )
      ).json();
      console.log("quoteResponse", quoteResponse);
      setQuote(quoteResponse);
    } catch (err) {
      console.log("err", err);
    }
  };
  return (
    <Card className="mx-auto mt-4 flex-col items-center space-y-2 rounded-xl border border-white bg-white/50 p-[20px] text-center shadow-[0px_4px_40px_rgba(0,_0,_0,_0.06),_inset_0px_0px_40px_rgba(255,_255,_255,_0.8)] sm:px-[40px] sm:py-[32px] mid:w-[803px]">
      <CardContent className="flex-col">
        <h4 className="mb-3 flex w-full items-center justify-start text-left text-lg font-bold text-grey-800 xs:text-[26px]">
          <div className="flex w-full flex-row justify-between">
            <div className="min-w-fit">Swap Tokens</div>
            <div className="flex flex-row justify-end">
              <p className="chakra-text mr-1 min-w-fit self-center text-[10px] font-normal text-grey-600">
                Powered by
              </p>
              <img
                alt="Powered by logo"
                src="/icons/jupiter-logo.svg"
                width={61}
                height={16}
              />
            </div>
          </div>
        </h4>
        <div className="relative">
          <TokenInput
            tokens={tokenBalances}
            selectedToken={selectedToken}
            label="You Pay:"
            tokenList={null}
            setInputSelectedToken={setInputSelectedToken}
            setAmount={setInputAmount}
            amount={inputAmount}
          />
          <div className="no-tap-highlight absolute inset-x-0 bottom-[-18px] z-50 mx-auto flex h-9 w-9 flex-shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-grey-100 bg-white focus:bg-grey-50 cursor-not-allowed border-grey-50">
            <ArrowUpDown className="h-4 w-4 text-grey-400" />
          </div>
        </div>
        <TokenInput
          label="You Receive:"
          tokenList={tokens}
          setOutputSelectedToken={setOutputSelectedToken}
          readOnly
          setAmount={setOutputAmount}
          amount={
            quote?.outAmount && outputToken && inputToken
              ? (
                  Number(quote.outAmount) / Math.pow(10, outputToken.decimals)
                ).toFixed(outputToken.decimals)
              : ""
          }
        />
        <SwapDetails />
        <div className="mt-6 flex  gap-1 flex-col-reverse justify-between mobile:flex-row">
          <Button variant="outline" className="text-grey-700">
            Cancel
          </Button>
          <Button disabled className="w-full mobile:w-auto">
            <Check className="mr-1 h-4 w-4" />
            Confirm & Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
