import {
  Connection,
  PublicKey,
  ParsedInstruction,
  clusterApiUrl,
} from "@solana/web3.js";
import { TokenDetails } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

// Your static token details
const STATIC_TOKENS: TokenDetails[] = [
  {
    name: "Solana",
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    price: "20",
    native: true,
  },
  {
    name: "USD Coin",
    mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    symbol: "USDC",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    price: "1",
    native: false,
  },
  {
    name: "USDT",
    mint: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
    symbol: "USDT",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    price: "1",
    native: false,
  },
];

// Connection setup
const connection = new Connection(clusterApiUrl("devnet"), {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 60000,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publicKey = searchParams.get("publicKey");

  if (!publicKey) {
    return NextResponse.json(
      { error: "Public key is required" },
      { status: 400 }
    );
  }

  let userPublicKey: PublicKey;
  try {
    userPublicKey = new PublicKey(publicKey);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid public key format", err: error },
      { status: 400 }
    );
  }

  try {
    // Fetch recent transactions
    const transactions = await connection.getSignaturesForAddress(
      userPublicKey,
      { limit: 20 }
    );

    // Fetch token accounts to get token balances

    const transactionDetails = await Promise.all(
      transactions.map(async (tx) => {
        try {
          const transaction = await connection.getParsedTransaction(
            tx.signature,
            {
              maxSupportedTransactionVersion: 0,
            }
          );

          if (!transaction) return null;

          const instruction = transaction.transaction.message.instructions[0];

          if ("parsed" in instruction) {
            const parsedInstruction = instruction as ParsedInstruction;
            const isReceive =
              parsedInstruction.parsed?.info?.destination ===
              userPublicKey.toBase58();
            const tokenMint = parsedInstruction.parsed?.info?.mint;

            const token =
              STATIC_TOKENS.find((t) => t.mint === tokenMint) ||
              STATIC_TOKENS[0];

            return {
              id: tx.signature,
              date: new Date(tx.blockTime! * 1000),
              type: isReceive ? "received" : "sent",
              token: token.symbol,
              amount:
                parsedInstruction.parsed?.info?.tokenAmount?.uiAmount ||
                parsedInstruction.parsed?.info?.lamports /
                  10 ** token.decimals ||
                0,
              from: parsedInstruction.parsed?.info?.source,
              to: parsedInstruction.parsed?.info?.destination,
              logoUrl: token.logoURI,
            };
          }

          return {
            id: tx.signature,
            date: new Date(tx.blockTime! * 1000),
            type: "unknown",
            token: "unknown",
            amount: 0,
            from: "unknown",
            to: "unknown",
            logoUrl: "",
          };
        } catch (error) {
          console.error(`Error fetching transaction ${tx.signature}:`, error);
          return null;
        }
      })
    );

    return NextResponse.json(transactionDetails.filter((t) => t !== null));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
