"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa6";
import WalletOverview from "./WalletOverview";
import { createMessageId, isAllowedOrigin } from "@/lib/messageUtils";
import { MessageData } from "@/lib/types";
import { ALLOWED_ORIGINS } from "@/lib/constants";
import { Session } from "next-auth";

const useMessageHandler = () => {
  const parentOriginRef = useRef<string | null>(null);
  const processedMessages = useRef<Set<string>>(new Set());
  const publicKeyRef = useRef<string | null>(null);

  // Modified sendMessageToParent to handle development environment
  const sendMessageToParent = useCallback((message: MessageData) => {
    if (typeof window === "undefined" || !window.parent) {
      console.error("No parent window found");
      return;
    }

    const enrichedMessage = {
      ...message,
      windowName: "default-window",
      timestamp: Date.now(),
    };

    const isDevelopment = process.env.NODE_ENV === "development";
    const developmentOrigins = ["http://localhost:3001"];
    const originsToTry = isDevelopment ? developmentOrigins : ALLOWED_ORIGINS;

    const sendToOrigin = (origin: string): boolean => {
      try {
        window.parent.postMessage(enrichedMessage, origin);
        console.log(`Successfully sent message to ${origin}:`, enrichedMessage);
        return true;
      } catch (err) {
        console.warn(`Failed to send to ${origin}:`, err);
        return false;
      }
    };

    // If we have a stored parent origin and it's valid, try it first
    if (parentOriginRef.current) {
      const isAllowed = isDevelopment
        ? developmentOrigins.includes(parentOriginRef.current)
        : isAllowedOrigin(parentOriginRef.current);

      if (isAllowed && sendToOrigin(parentOriginRef.current)) {
        return;
      }
    }

    // Try all allowed origins
    let messageSent = false;
    for (const origin of originsToTry) {
      if (sendToOrigin(origin)) {
        parentOriginRef.current = origin;
        messageSent = true;
        break;
      }
    }

    if (!messageSent) {
      console.error("Failed to send message to any allowed origin");
    }
  }, []);

  // Modified to handle development environment
  const sendPublicKey = useCallback(
    (publicKey: string, dAppSessionId?: string, tipLinkSessionId?: string) => {
      publicKeyRef.current = publicKey;
      const isDevelopment = process.env.NODE_ENV === "development";
      const originsToTry = isDevelopment
        ? ["http://localhost:3000", "http://localhost:3001"]
        : ALLOWED_ORIGINS;

      originsToTry.forEach((origin) => {
        try {
          window.parent.postMessage(
            {
              type: "public_key",
              publicKey,
              windowName: "default-window",
              timestamp: Date.now(),
              dAppSessionId,
              tipLinkSessionId,
            },
            origin
          );
        } catch (err) {
          console.warn(`Failed to send public key to ${origin}:`, err);
        }
      });
    },
    []
  );

  return {
    sendMessageToParent,
    sendPublicKey,
    parentOriginRef,
    processedMessages,
    publicKeyRef,
  };
};
const LoginDialog = ({
  onGoogleLogin,
  handleLoginClose,
  showLoginView,
}: {
  onGoogleLogin: () => void;
  handleLoginClose: () => void;
  showLoginView: boolean;
}) => (
  <Dialog onOpenChange={handleLoginClose} defaultOpen={showLoginView}>
    <DialogContent className="relative w-full bg-white px-8 pb-8 pt-10 dark:bg-gray-950 mobile:min-w-[390px] mobile:px-10 sm:max-w-[430px] rounded-xl shadow-lg">
      <div className="mx-auto flex flex-shrink-0 items-center justify-center">
        <Image
          src="/icons/logo.png"
          alt="logo"
          width={90}
          height={90}
          priority
        />
      </div>

      <DialogHeader>
        <DialogTitle className="flex justify-center text-center my-3 text-[20px] font-bold leading-none text-gray-800 dark:text-gray-50 mobile:text-[24px]">
          Login to HyperLink
        </DialogTitle>
        <p className="mb-3 text-center text-xs text-gray-600 dark:text-gray-200 mobile:text-base">
          Click below to continue with your Google account.
        </p>
      </DialogHeader>

      <DialogFooter>
        <button
          onClick={onGoogleLogin}
          className="w-full relative h-11 rounded-lg bg-black transition-colors duration-150 ease-linear hover:bg-gray-800"
        >
          <div className="absolute left-[3px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-white">
            <FaGoogle className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-white pl-7">Login with Google</h3>
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
type UserInfoProps = {
  session: Session | null;
};

export default function EmbeddedWallet({ session }: UserInfoProps) {
  const [showWalletView, setShowWalletView] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<any[]>([]);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState(0);
  const [showLoginView, setShowLoginView] = useState(true);
  const {
    sendMessageToParent,
    sendPublicKey,
    parentOriginRef,
    processedMessages,
    publicKeyRef,
  } = useMessageHandler();
  console.log("session", session);
  const handleMessage = useCallback(
    (event: MessageEvent<MessageData>) => {
      const origin = event.origin;

      // Allow messages from both ports during development
      const isDevelopment = process.env.NODE_ENV === "development";
      const isValidOrigin = isDevelopment
        ? origin.startsWith("http://localhost")
        : isAllowedOrigin(origin);

      if (!isValidOrigin) {
        console.warn("Unauthorized origin:", origin);
        return;
      }

      const messageId = createMessageId(
        event.data?.type,
        event.data?.timestamp
      );
      if (processedMessages.current.has(messageId)) return;

      processedMessages.current.add(messageId);
      if (processedMessages.current.size > 100) {
        processedMessages.current.clear();
      }

      parentOriginRef.current = origin;

      if (!event.data || typeof event.data !== "object") {
        console.warn("Invalid message format");
        return;
      }

      console.log("Processing message:", event.data);

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
        case "tiplink_autoconnect_from_redirect":
          sendMessageToParent({
            type: `${event.data.type}_received`,
          });
          break;

        case "show_wallet":
          console.log("show_wallet");
          setShowWalletView(true);
          sendMessageToParent({
            type: "show_wallet",
            windowName: "default-window",
          });
          break;
        case "login_success":
          setShowLoginView(false);
          break;
        case "disconnect":
          // Clear all references and state
          publicKeyRef.current = null;
          parentOriginRef.current = null;
          setShowLoginView(true); // Reset to initial state
          break;
        default:
          console.log("Unhandled message type:", event.data.type);
      }
    },
    [sendMessageToParent]
  );

  const fetchTokenBalances = async (publicKey: string) => {
    try {
      const response = await fetch(`/api/tokens?address=${publicKey}`);
      if (!response.ok) throw new Error("Failed to fetch token balances");
      const data = await response.json();
      setTokenBalances(data.tokens || []);
      setTotalBalanceUSD(data.totalBalance || 0);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("message", handleMessage);
    sendMessageToParent({ type: "ready" });

    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage, sendMessageToParent]);

  const handleLoginSuccess = useCallback(
    (publicKey: string) => {
      if (!publicKey) {
        console.error("No public key received from login");
        return;
      }

      // Store and send the public key
      sendPublicKey(publicKey);

      // Fetch token balances with the new public key
      fetchTokenBalances(publicKey);

      // Update wallet view
      setShowWalletView(true);
    },
    [sendPublicKey]
  );
  console.log(
    "provider",
    localStorage.getItem("7z2fo3j1mljjfcmdrk5r32xaufzct6git2bjc17wdnoy_SFA")
  );
  const handleGoogleLogin = useCallback(() => {
    console.log("Initiating Google login");
    sendMessageToParent({
      type: "login_initiated",
      windowName: "default-window",
    });

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Create popup and add message listener for login response
    const loginWindow = window.open(
      "/embedded_adapter_login",
      "Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Handle login response message
    const handleLoginResponse = (event: MessageEvent) => {
      if (!isAllowedOrigin(event.origin)) return;

      if (event.data?.type === "login_success" && event.data?.publicKey) {
        handleLoginSuccess(event.data.publicKey);
        window.removeEventListener("message", handleLoginResponse);
      }
    };

    window.addEventListener("message", handleLoginResponse);
  }, [sendMessageToParent, handleLoginSuccess]);

  const handleOverviewClose = useCallback(() => {
    setShowWalletView(false);
    sendMessageToParent({
      type: "hide_wallet",
      windowName: "default-window",
    });
  }, [sendMessageToParent]);
  const handleLoginClose = useCallback(() => {
    // Reset all state
    setShowLoginView(false);
    setShowWalletView(false);
    setTokenBalances([]);
    setTotalBalanceUSD(0);
    publicKeyRef.current = null;

    // Clear any stored session data
    localStorage.clear(); // Or specifically clear wallet-related items

    // Notify parent
    sendMessageToParent({
      type: "disconnect",
      windowName: "default-window",
    });

    // Wait for disconnect acknowledgment before final cleanup
    const cleanup = () => {
      processedMessages.current.clear();
    };

    cleanup();
  }, [sendMessageToParent]);

  return showWalletView ? (
    <WalletOverview
      showWalletView={showWalletView}
      onClose={handleOverviewClose}
      session={session}
    />
  ) : (
    <LoginDialog
      showLoginView={showLoginView}
      handleLoginClose={handleLoginClose}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}
