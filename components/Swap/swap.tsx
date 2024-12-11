"use client";
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";

import { TokenApiList, useFetchTokens } from "@/app/hooks/useFetchTokens";
import { TokenListDialog } from "./TokenListDialog";
import { Button } from "../ui/button";
import { TokenWithBalance } from "@/lib/types";

interface SwapProps {
  tokenBalances: TokenWithBalance[]; // Changed to array
}

export function Swap({ tokenBalances }: SwapProps) {
  const { tokens, loading, error } = useFetchTokens();
  const [baseAsset, setBaseAsset] = useState<TokenApiList | undefined>(
    tokens?.[0]
  );
  const [quoteAsset, setQuoteAsset] = useState<TokenApiList | undefined>(
    tokens?.[1]
  );
  const [baseAmount, setBaseAmount] = useState<string>("");
  const [quoteAmount, setQuoteAmount] = useState<string>("");
  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState<any>(null);

  useEffect(() => {
    setBaseAsset(tokens?.[0]);
    setQuoteAsset(tokens?.[1]);
  }, [tokens]);

  useEffect(() => {
    if (!baseAmount) {
      setQuoteAmount("");
      return;
    }
    setFetchingQuote(true);

    if (quoteAsset?.address && baseAsset?.address) {
      axios
        .get(
          `https://quote-api.jup.ag/v6/quote?inputMint=${
            baseAsset.address
          }&outputMint=${quoteAsset.address}&amount=${
            Number(baseAmount) * 10 ** baseAsset.decimals
          }&slippageBps=50`
        )
        .then((res) => {
          setQuoteAmount(
            (
              Number(res.data.outAmount) / Number(10 ** quoteAsset.decimals)
            ).toString()
          );
          setFetchingQuote(false);
          setQuoteResponse(res.data);
        })
        .catch((error) => {
          console.error("Quote fetch error:", error);
          setFetchingQuote(false);
        });
    }
  }, [baseAsset, quoteAsset, baseAmount]);

  const swapAssets = () => {
    const temp = baseAsset;
    setBaseAsset(quoteAsset);
    setQuoteAsset(temp);
  };

  // Helper function to get token balance
  const getTokenBalance = (symbol?: string) => {
    if (!tokenBalances || !symbol) return "0";
    const token = tokenBalances.find((t) => t.symbol === symbol);
    return token?.balance || "0";
  };

  return (
    <div className="pl-4 pt-12 pb-12 bg-slate-50">
      <div className="text-2xl font-bold pb-4">Swap Tokens</div>
      <SwapInputRow
        tokenBalances={tokenBalances}
        amount={baseAmount}
        onAmountChange={(value: string) => {
          setBaseAmount(value);
        }}
        onSelect={(asset) => {
          setBaseAsset(asset);
        }}
        selectedToken={baseAsset}
        title={"You pay:"}
        topBorderEnabled={true}
        bottomBorderEnabled={false}
        subtitle={
          <div className="text-slate-500 pt-1 text-sm pl-1 flex">
            <div className="font-normal pr-1">Current Balance:</div>
            <div className="font-semibold">
              {getTokenBalance(baseAsset?.symbol)} {baseAsset?.symbol}
            </div>
          </div>
        }
      />

      <div className="flex justify-center">
        <div
          onClick={swapAssets}
          className="cursor-pointer rounded-full w-10 h-10 border absolute mt-[-20px] bg-white flex justify-center pt-2"
        >
          <SwapIcon />
        </div>
      </div>

      <SwapInputRow
        tokenBalances={tokenBalances}
        inputLoading={fetchingQuote}
        inputDisabled={true}
        amount={quoteAmount}
        onSelect={(asset) => {
          setQuoteAsset(asset);
        }}
        selectedToken={quoteAsset}
        title={"You receive:"}
        topBorderEnabled={false}
        bottomBorderEnabled={true}
      />

      <div className="flex justify-end pt-4">
        <Button
          onClick={async () => {
            try {
              const res = await axios.post("/api/swap", {
                quoteResponse,
              });
              if (res.data.txnId) {
                alert("Swap done!");
              }
            } catch (e) {
              alert("Error while sending a txn");
            }
          }}
        >
          Swap
        </Button>
      </div>
    </div>
  );
}

function SwapInputRow({
  tokenBalances,
  onSelect,
  amount,
  onAmountChange,
  selectedToken,
  title,
  subtitle,
  topBorderEnabled,
  bottomBorderEnabled,
  inputDisabled,
  inputLoading,
}: {
  tokenBalances: TokenWithBalance[]; // Changed to array
  onSelect: (asset: TokenApiList) => void;
  selectedToken?: TokenApiList;
  title: string;
  subtitle?: ReactNode;
  topBorderEnabled: boolean;
  bottomBorderEnabled: boolean;
  amount?: string;
  onAmountChange?: (value: string) => void;
  inputDisabled?: boolean;
  inputLoading?: boolean;
}) {
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);

  // Helper function to get token balance
  const getTokenBalance = () => {
    if (!tokenBalances || !selectedToken) return "0";
    const token = tokenBalances.find((t) => t.symbol === selectedToken.symbol);
    return token?.balance || "0";
  };

  return (
    <div
      className={`border flex justify-between pl-6 pt-6 pb-6 
        ${topBorderEnabled ? "rounded-t-xl" : ""} 
        ${bottomBorderEnabled ? "rounded-b-xl" : ""}
        ${insufficientFunds ? "border-red-500" : "border-gray-300"}`}
    >
      <div>
        <div className="text-xs font-semibold mb-1">{title}</div>
        <TokenListDialog selectedToken={selectedToken} onSelect={onSelect} />
        {subtitle}
      </div>
      <div>
        <div className="relative">
          <div>
            <input
              disabled={inputDisabled}
              onChange={(e) => {
                onAmountChange?.(e.target.value);
                const balance = getTokenBalance();
                const validAmount =
                  e.target.value !== undefined
                    ? parseFloat(e.target.value)
                    : NaN;
                const insufficientFunds = parseFloat(balance) < validAmount;
                setInsufficientFunds(insufficientFunds);
              }}
              placeholder="0"
              type="number"
              className={`bg-slate-50 text-right p-6 outline-none text-4xl pr-2 
              ${inputLoading ? "text-transparent" : ""} 
              ${insufficientFunds ? "text-red-500" : "text-black"}`}
              dir="ltr"
              value={amount}
            />
            {insufficientFunds && (
              <div className="flex justify-end mr-2">
                <div className="flex text-xs mb-1 mt-1 px-2 py-1 font-bold bg-[#fdeaeb] text-[#de3030] rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 text-red-500 mr-1"
                  >
                    <path d="M12 2L2 22h20L12 2z" />
                    <line x1="12" y1="8" x2="12" y2="13" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>{" "}
                  Insufficient Funds
                </div>
              </div>
            )}

            {inputLoading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-12">
                <div className="flex space-x-1 justify-center items-center dark:invert">
                  <span className="sr-only">Loading...</span>
                  <div className="h-1.5 w-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-1.5 w-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-1.5 w-1.5 bg-black rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SwapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
      />
    </svg>
  );
}
