import {
  Connection,
  Transaction,
  Keypair,
  PublicKey,
  SystemProgram,
  clusterApiUrl,
  VersionedTransaction,
} from "@solana/web3.js";

interface TransactionDetails {
  feePayer?: string;
  recentBlockhash?: string;
  instructionsCount: number;
  solAmount: number;
  usdAmount: number;
  receivingAsset: {
    name: string;
    amount: number;
  };
  hyperLinkHandle: string;
  originalMessage: string;
}

interface MessageToParent {
  type: string;
  status: string;
  requestId?: string;
  signedTransaction?: string;
  windowName?: string;
  publicKey?: string;
  error?: string;
}

const handleTransactionConfirm = async (
  transactionDetails: TransactionDetails | null,
  currentRequestId: string,
  sendMessageToParent: (message: MessageToParent) => void,
  setIsLoading: (loading: boolean) => void,
  getPrivateKey: () => Promise<string>,
  setCurrentView: (view: string) => void
): Promise<void> => {
  setIsLoading(true);
  let connection: Connection | null = null;

  try {
    if (!transactionDetails) {
      throw new Error("No transaction details available");
    }

    console.log("Starting transaction signing process");
    console.log("Transaction details:", transactionDetails);

    // Get keypair from private key
    const keypair = await getKeypairFromPrivateKey(getPrivateKey);
    if (!keypair) {
      throw new Error("Failed to generate keypair");
    }
    console.log("Using public key:", keypair.publicKey.toBase58());

    // Deserialize transaction
    const transaction = deserializeTransaction(
      transactionDetails.originalMessage
    );
    console.log("Deserialized transaction:", transaction);

    // Set fee payer if not already set
    if (!transaction.feePayer) {
      transaction.feePayer = keypair.publicKey;
      console.log("Set feePayer to:", keypair.publicKey.toBase58());
    }

    // Connect to network and get latest blockhash
    connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    console.log("Updated blockhash to:", blockhash);

    // Sign and verify transaction
    try {
      transaction.sign(keypair);
      console.log("Transaction signed successfully");

      const isVerified = transaction.verifySignatures();
      if (!isVerified) {
        throw new Error("Transaction signature verification failed");
      }
      console.log("Signature verification successful");
    } catch (signError) {
      console.error("Signing/verification error:", signError);
      throw new Error(
        `Transaction signing failed: ${
          signError instanceof Error ? signError.message : "Unknown error"
        }`
      );
    }

    // Serialize the signed transaction
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: true,
      verifySignatures: true,
    });
    console.log("Transaction serialized successfully");

    // Send success response
    sendMessageToParent({
      type: "signed_transaction",
      status: "success",
      requestId: currentRequestId,
      signedTransaction: serializedTransaction.toString("base64"),
      windowName: "",
      publicKey: keypair.publicKey.toBase58(),
    });
    console.log("Success message sent to parent");
  } catch (error) {
    console.error("Transaction signing error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    sendMessageToParent({
      type: "sign_error",
      status: "error",
      requestId: currentRequestId,
      error:
        error instanceof Error ? error.message : "Failed to sign transaction",
      windowName: "",
    });
  } finally {
    setIsLoading(false);
  }
};

const getKeypairFromPrivateKey = async (
  getPrivateKey: () => Promise<string>
): Promise<Keypair> => {
  try {
    const privateKeyString = await getPrivateKey();
    if (!privateKeyString) {
      throw new Error("No private key found");
    }

    const secretKey = hexToUint8Array(privateKeyString);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error("Error creating keypair:", error);
    throw new Error(
      `Invalid private key format: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

const deserializeTransaction = (base64Message: string): Transaction => {
  try {
    if (!base64Message) {
      throw new Error("No transaction message provided");
    }

    const buffer = Buffer.from(base64Message, "base64");
    const transaction = Transaction.from(buffer);

    if (!transaction) {
      throw new Error("Failed to create transaction from buffer");
    }

    return transaction;
  } catch (error) {
    console.error("Transaction deserialization error:", error);
    throw new Error(
      `Failed to deserialize transaction: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

const hexToUint8Array = (hexString: string): Uint8Array => {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }

  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
  }
  return bytes;
};

export {
  handleTransactionConfirm,
  getKeypairFromPrivateKey,
  deserializeTransaction,
  hexToUint8Array,
};
