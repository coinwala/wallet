export interface TokenDetails {
  name: string;
  mint: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  price?: string;
  native?: boolean;
}

export interface TokenWithBalance extends TokenDetails {
  balance: string;
  usdBalance: string;
}

export type AllowedOrigin =
  | "http://localhost:3000"
  | "http://localhost:3001"
  | "https://staging.tiplink.io"
  | "https://dev.tiplink.io"
  | "https://adapter.tiplink.io"
  | "https://tiplink.io";

export interface MessageData {
  type: string;
  windowName?: string;
  dAppSessionId?: string;
  tipLinkSessionId?: string;
  publicKey?: string;
  title?: string;
  requestId?: string;
  timestamp?: number;
  message?: string;
}
export interface TransactionDetails {
  feePayer?: string;
  recentBlockhash?: string;
  instructionsCount: number;
  signatures: (string | undefined)[];
}
