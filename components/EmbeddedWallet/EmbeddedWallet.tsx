"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import WalletOverview from "./WalletOverview";
import { createMessageId, isAllowedOrigin } from "@/lib/messageUtils";
import { MessageData, TransactionDetails } from "@/lib/types";
import { ALLOWED_ORIGINS } from "@/lib/constants";
import { Session } from "next-auth";
import { Transaction } from "@solana/web3.js";
import TransactionDialog from "./TransactionDialog";
import { LoginDialog } from "./LoginDialog";

// View types enum
enum ViewType {
  WALLET = "WALLET",
  LOGIN = "LOGIN",
  TRANSACTION = "TRANSACTION",
}

const useMessageHandler = () => {
  const parentOriginRef = useRef<string | null>(null);
  const processedMessages = useRef<Set<string>>(new Set());
  const publicKeyRef = useRef<string | null>(null);

  const sendMessageToParent = useCallback((message: MessageData) => {
    if (typeof window === "undefined" || !window.parent) {
      console.error("No parent window found");
      return;
    }

    const enrichedMessage = {
      ...message,
      windowName: "",
      timestamp: Date.now(),
    };

    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      try {
        window.parent.postMessage(enrichedMessage, "*");
        console.log("Message sent with wildcard origin:", enrichedMessage);
      } catch (err) {
        console.error("Failed to send message:", err);
      }
      return;
    }

    if (parentOriginRef.current) {
      try {
        window.parent.postMessage(enrichedMessage, parentOriginRef.current);
      } catch (err) {
        console.warn(`Failed to send to ${parentOriginRef.current}:`, err);
      }
    } else {
      let messageSent = false;
      for (const origin of ALLOWED_ORIGINS) {
        try {
          window.parent.postMessage(enrichedMessage, origin);
          parentOriginRef.current = origin;
          messageSent = true;
          break;
        } catch (err) {
          console.warn(`Failed to send to ${origin}:`, err);
        }
      }

      if (!messageSent) {
        console.error("Failed to send message to any allowed origin");
      }
    }
  }, []);

  const sendPublicKey = useCallback(
    (publicKey: string, dAppSessionId?: string, tipLinkSessionId?: string) => {
      publicKeyRef.current = publicKey;
      sendMessageToParent({
        type: "public_key",
        publicKey,
        windowName: "",
        timestamp: Date.now(),
        dAppSessionId,
        tipLinkSessionId,
      });
    },
    [sendMessageToParent]
  );

  return {
    sendMessageToParent,
    sendPublicKey,
    parentOriginRef,
    processedMessages,
    publicKeyRef,
  };
};

type UserInfoProps = {
  session: Session | null;
};

export default function EmbeddedWallet({ session }: UserInfoProps) {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.LOGIN);
  const [transectionRequestId, setTransactionRequestId] = useState<string>("");
  const {
    sendMessageToParent,
    sendPublicKey,
    parentOriginRef,
    processedMessages,
    publicKeyRef,
  } = useMessageHandler();

  function deserializeTransaction(base64Message: string): Transaction {
    try {
      const buffer = Buffer.from(base64Message, "base64");
      return Transaction.from(buffer);
    } catch (error) {
      console.error("Transaction deserialization error:", error);
      throw error;
    }
  }

  function processTransaction(base64Message: string): TransactionDetails {
    try {
      const reconstructedTransaction = deserializeTransaction(base64Message);

      return {
        feePayer: reconstructedTransaction.feePayer?.toBase58(),
        recentBlockhash: reconstructedTransaction.recentBlockhash,
        instructionsCount: reconstructedTransaction.instructions?.length ?? 0,
        signatures: reconstructedTransaction.signatures.map((sig) =>
          sig.signature?.toString("base64")
        ),
      };
    } catch (error) {
      console.error("Transaction processing error:", error);
      throw error;
    }
  }

  const handleMessage = useCallback(
    (event: MessageEvent<MessageData>) => {
      const isDevelopment = process.env.NODE_ENV === "development";
      if (!isDevelopment && !isAllowedOrigin(event.origin)) {
        console.warn("Unauthorized origin:", event.origin);
        return;
      }

      parentOriginRef.current = event.origin;

      const messageId = createMessageId(
        event.data?.type,
        event.data?.timestamp
      );
      if (processedMessages.current.has(messageId)) return;

      processedMessages.current.add(messageId);
      if (processedMessages.current.size > 100) {
        processedMessages.current.clear();
      }

      if (!event.data || typeof event.data !== "object") {
        console.warn("Invalid message format");
        return;
      }

      console.log("Processing message:", event);

      switch (event.data.type) {
        case "ack":
          sendMessageToParent({
            type: "ready",
            dAppSessionId: event.data.dAppSessionId,
            tipLinkSessionId: event.data.tipLinkSessionId,
          });
          break;

        case "public_key":
          console.log("Received public key:", event.data.publicKey);
          if (event.data.publicKey) {
            publicKeyRef.current = event.data.publicKey;
            sendMessageToParent({
              type: "public_key",
              windowName: "",
              publicKey: event.data.publicKey,
            });
          }
          break;

        case "ack_loaded_public_key":
          sendMessageToParent({
            type: "loaded_public_key",
            dAppSessionId: event.data.dAppSessionId,
            tipLinkSessionId: event.data.tipLinkSessionId,
            publicKey: publicKeyRef.current || "",
          });
          break;

        case "click_to_continue":
        case "embedded_login":
          sendMessageToParent({
            type: `${event.data.type}_received`,
          });
          break;

        case "show_wallet":
          console.log("show_wallet");
          setCurrentView(ViewType.WALLET);
          sendMessageToParent({
            type: "show_wallet",
            windowName: "",
          });
          break;

        case "login_success":
          console.log("login_success");
          setCurrentView(ViewType.WALLET);
          break;

        case "sign_transaction":
          try {
            const messageData: MessageData = event.data;
            console.log("messageData", messageData);
            if (messageData.message) {
              const processedTransaction = processTransaction(
                messageData.message
              );
              setTransactionRequestId(messageData.requestId!);
              console.log(
                "Processed Transaction Details:",
                processedTransaction
              );
              setCurrentView(ViewType.TRANSACTION);
            } else {
              console.error("No transaction message found");
            }
          } catch (error) {
            console.error("Sign transaction error:", error);
          }
          break;

        default:
          console.log("Unhandled message type:", event.data.type);
      }
    },
    [sendMessageToParent]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("message", handleMessage);
    console.log("121");
    sendMessageToParent({ type: "ready" });

    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage, sendMessageToParent]);

  const handleLoginSuccess = useCallback(
    (publicKey: string) => {
      if (!publicKey) {
        console.error("No public key received from login");
        return;
      }
      sendPublicKey(publicKey);
      setCurrentView(ViewType.WALLET);
    },
    [sendPublicKey]
  );

  const handleGoogleLogin = useCallback(() => {
    console.log("Initiating Google login");
    sendMessageToParent({
      type: "login_initiated",
      windowName: "",
    });

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const loginUrl = new URL("/embedded_adapter_login", window.location.origin);
    if (parentOriginRef.current) {
      loginUrl.searchParams.set("parentOrigin", parentOriginRef.current);
    }

    const loginWindow = window.open(
      loginUrl.toString(),
      "Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleLoginResponse = (event: MessageEvent) => {
      const isDevelopment = process.env.NODE_ENV === "development";
      const isValidOrigin = isDevelopment
        ? event.origin.startsWith("http://localhost:3000") ||
          event.origin.startsWith("http://localhost:3001")
        : isAllowedOrigin(event.origin);

      if (!isValidOrigin) return;

      if (event.data?.type === "login_success" && event.data?.publicKey) {
        handleLoginSuccess(event.data.publicKey);
        window.removeEventListener("message", handleLoginResponse);
      }
    };

    window.addEventListener("message", handleLoginResponse);
  }, [sendMessageToParent, handleLoginSuccess]);

  const handleOverviewClose = useCallback(() => {
    setCurrentView(ViewType.LOGIN);
    sendMessageToParent({
      type: "hide_wallet",
      windowName: "",
    });
  }, [sendMessageToParent]);

  const handleLoginClose = useCallback(() => {
    sendMessageToParent({
      type: "cancel_connect",
      windowName: "",
    });
  }, [sendMessageToParent]);

  const viewComponents: Record<ViewType, () => JSX.Element> = {
    [ViewType.WALLET]: () => (
      <WalletOverview
        showWalletView={currentView === ViewType.WALLET}
        onClose={handleOverviewClose}
        session={session}
      />
    ),
    [ViewType.LOGIN]: () => (
      <LoginDialog
        showLoginView={currentView === ViewType.LOGIN}
        handleLoginClose={handleLoginClose}
        onGoogleLogin={handleGoogleLogin}
      />
    ),
    [ViewType.TRANSACTION]: () => <TransactionDialog />,
  };

  return viewComponents[currentView]();
}
