import { NextRequest, NextResponse } from "next/server";
import { TokenWithBalance, TokenDetails } from "@/lib/types";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import axios from "axios";

// Static list of tokens for Solana devnet
const STATIC_TOKENS: TokenDetails[] = [
  {
    name: "Solana",
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    native: true,
  },
  {
    name: "USD Coin",
    mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    symbol: "USDC",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    native: false,
  },
  {
    name: "USDT",
    mint: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
    symbol: "USDT",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    native: false,
  },
];

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function getSolanaPrice(): Promise<number> {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    return response.data.solana.usd;
  } catch (error) {
    console.error("Error fetching Solana price:", error);

    return 20;
  }
}

async function getAccountBalances(
  address: string
): Promise<Map<string, number>> {
  const pubkey = new PublicKey(address);
  const balances = new Map<string, number>();

  try {
    const solBalance = await connection.getBalance(pubkey);
    balances.set(
      "So11111111111111111111111111111111111111112",
      solBalance / 1e9
    );
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      pubkey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    tokenAccounts.value.forEach((accountInfo) => {
      const parsedInfo = accountInfo.account.data.parsed.info;
      const tokenMint = parsedInfo.mint;
      const amount = parsedInfo.tokenAmount.uiAmount;
      balances.set(tokenMint, amount);
    });

    return balances;
  } catch (error) {
    console.error("Error fetching account balances:", error);
    throw error;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") as string;

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  try {
    const balances = await getAccountBalances(address);
    const solPrice = await getSolanaPrice();

    const tokensWithBalances: TokenWithBalance[] = await Promise.all(
      STATIC_TOKENS.map(async (token) => {
        const balance = token.native
          ? balances.get(token.mint) || 0
          : balances.get(token.mint) || 0;

        let price = 1; // Default price for stablecoins
        if (token.symbol === "SOL") {
          price = solPrice;
        }

        const usdBalance = (balance * price).toFixed(2);
        return {
          ...token,
          balance: balance.toFixed(token.decimals),
          usdBalance,
          price: price.toString(),
        };
      })
    );

    const totalBalance = tokensWithBalances
      .reduce((acc, val) => acc + Number(val.usdBalance), 0)
      .toFixed(2);

    return NextResponse.json({
      tokens: tokensWithBalances,
      totalBalance,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching token balances" },
      { status: 500 }
    );
  }
}
