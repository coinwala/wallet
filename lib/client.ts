import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import { web3auth } from "./web3auth";

let connection: Connection | null = null;
let publicKey: PublicKey | null = null;

// Updated Solana devnet RPC endpoint
const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com";

export function initClients() {
  if (typeof window !== "undefined" && web3auth.provider) {
    connection = new Connection(SOLANA_RPC_ENDPOINT);

    web3auth.provider
      .request({ method: "getAccounts" })
      .then((accounts: unknown) => {
        if (
          Array.isArray(accounts) &&
          accounts.length > 0 &&
          typeof accounts[0] === "string"
        ) {
          publicKey = new PublicKey(accounts[0]);
        } else {
          console.error("Unable to get a valid public key from Web3Auth");
        }
      })
      .catch((error) => {
        console.error("Error getting accounts from Web3Auth:", error);
      });
  }
}

export function getConnection() {
  if (typeof window !== "undefined" && !connection) {
    initClients();
  }
  return connection;
}

export function getPublicKey() {
  if (typeof window !== "undefined" && !publicKey) {
    initClients();
  }
  return publicKey;
}
export function getPrivateKey() {
  if (typeof window !== "undefined" && web3auth.provider) {
    return web3auth.provider.request({ method: "solanaPrivateKey" });
  }
  return null;
}

export function formatSOL(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(9);
}

export function parseSOL(sol: string): number {
  return Math.floor(parseFloat(sol) * LAMPORTS_PER_SOL);
}

export async function getBalance(address: PublicKey): Promise<string> {
  if (!connection) throw new Error("Connection not initialized");
  const balance = await connection.getBalance(address);
  return formatSOL(balance);
}

export async function sendTransaction(
  from: PublicKey,
  to: string,
  amount: number
) {
  if (!connection || !web3auth.provider)
    throw new Error("Connection or provider not initialized");

  const transaction = await createTransferTransaction(from, to, amount);

  try {
    // Get the private key from Web3Auth
    const privateKeyHex = (await web3auth.provider.request({
      method: "solanaPrivateKey",
    })) as string;

    if (!privateKeyHex)
      throw new Error("Failed to get private key from Web3Auth");

    // Convert the hex string to Uint8Array
    const privateKeyUint8 = new Uint8Array(Buffer.from(privateKeyHex, "hex"));

    // Create a Solana keypair from the private key
    const keypair = Keypair.fromSecretKey(privateKeyUint8);

    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);

    return signature;
  } catch (error) {
    console.error("Transaction error:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

async function createTransferTransaction(
  from: PublicKey,
  to: string,
  amount: number
) {
  if (!connection) throw new Error("Connection not initialized");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: new PublicKey(to),
      lamports: amount,
    })
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = from;

  return transaction;
}
