/**
 * Token related interfaces
 */
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

/**
 * Allowed origins for message communication
 */
export type AllowedOrigin =
  | "http://localhost:3000"
  | "http://localhost:3001"
  | "https://staging.tiplink.io"
  | "https://dev.tiplink.io"
  | "https://adapter.tiplink.io"
  | "https://tiplink.io";

/**
 * Base transaction details interface
 */
export interface BaseTransactionDetails {
  feePayer?: string;
  recentBlockhash?: string;
  instructionsCount: number;
}

/**
 * Extended transaction details with additional information
 */
export interface ExtendedTransactionDetails extends BaseTransactionDetails {
  solAmount: number;
  usdAmount: number;
  receivingAsset: {
    name: string;
    amount: number;
  };
  hyperLinkHandle: string;
  originalMessage: string;
  transactionHash?: string;
}

/**
 * Transaction with confirmed hash
 */
export interface TransactionWithHash extends ExtendedTransactionDetails {
  transactionHash: string;
}

/**
 * Message data structure for communication
 */
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
  status?: string;
  signedTransaction?: string;
  error?: string;
  transactionHash?: string;
  signed_transaction?: string;
  signed_message?: string;
}

/**
 * Message structure for parent window communication
 */
export interface MessageToParent {
  type: string;
  status: string;
  requestId?: string;
  signedTransaction?: string;
  windowName?: string;
  publicKey?: string;
  error?: string;
}

/**
 * Solana price data structure
 */
export interface SolanaPrice {
  solana: {
    usd: number;
  };
}

export interface NFTMetadata {
  mint: string;
  name: string;
  uri: string;
  symbol: string;
  image: string | undefined;
  metadataAddress?: string;
  updateAuthorityAddress?: string;
  sellerFeeBasisPoints?: number;
  primarySaleHappened?: boolean;
  isMutable?: boolean;
  tokenStandard?: number | null;
  collection?: {
    address: string;
    verified: boolean;
  } | null;
  uses?: any;
  creators?: Array<{
    address: string;
    verified?: boolean;
    share?: number;
  }>;
}
