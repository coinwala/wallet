"use client";
import React, { useEffect, useRef, useState } from "react";
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

type AllowedOrigin =
  | "http://localhost:3000"
  | "http://localhost:3001"
  | "https://staging.tiplink.io"
  | "https://dev.tiplink.io"
  | "https://adapter.tiplink.io"
  | "https://tiplink.io";

interface MessageData {
  type: string;
  windowName?: string;
  dAppSessionId?: string;
  tipLinkSessionId?: string;
  publicKey?: string;
  title?: string;
  requestId?: string;
  timestamp?: number;
}

const ORIGIN_MAP: Record<string, AllowedOrigin> = {
  production: "http://localhost:3001",
  staging: "https://staging.tiplink.io",
  development: "https://dev.tiplink.io",
  adapter: "https://adapter.tiplink.io",
  local: "https://tiplink.io",
} as const;

const ALLOWED_ORIGINS: AllowedOrigin[] = [
  ...Object.values(ORIGIN_MAP),
  "http://localhost:3000",
  "http://localhost:3001",
];

const isAllowedOrigin = (origin: string): origin is AllowedOrigin => {
  return ALLOWED_ORIGINS.includes(origin as AllowedOrigin);
};

export default function EmbeddedWallet() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const parentOriginRef = useRef<string | null>(null);
  const processedMessages = useRef<Set<string>>(new Set());
  const [showWalletView, setShowWalletView] = useState(false);
  const sendMessageToParent = (message: MessageData) => {
    if (typeof window === "undefined" || !window.parent) {
      console.error("No parent window found");
      return;
    }

    const enrichedMessage = {
      ...message,
      windowName: "default-window", // Always use consistent window name
      timestamp: Date.now(),
    };

    try {
      if (parentOriginRef.current && isAllowedOrigin(parentOriginRef.current)) {
        window.parent.postMessage(enrichedMessage, parentOriginRef.current);
        console.log(`Sent message to parent:`, enrichedMessage);
      } else {
        // Try each origin until one succeeds
        for (const origin of ALLOWED_ORIGINS) {
          try {
            window.parent.postMessage(enrichedMessage, origin);
            parentOriginRef.current = origin; // Remember successful origin
            console.log(`Sent message to ${origin}:`, enrichedMessage);
            break; // Stop after first successful send
          } catch (err) {
            console.warn(`Failed to send to ${origin}:`, err);
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = (event: MessageEvent<MessageData>) => {
      const origin = event.origin;
      console.log("event.origin", event);
      if (!isAllowedOrigin(origin)) {
        console.warn("Unauthorized origin:", origin);
        return;
      }

      // Generate unique message identifier
      const messageId = `${event.data?.type}-${
        event.data?.timestamp || Date.now()
      }`;

      // Skip if already processed
      if (processedMessages.current.has(messageId)) {
        return;
      }
      processedMessages.current.add(messageId);

      // Clean up processed messages periodically
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

        case "ack_loaded_public_key":
          sendMessageToParent({
            type: "loaded_public_key",
            dAppSessionId: event.data.dAppSessionId,
            tipLinkSessionId: event.data.tipLinkSessionId,
            publicKey: "7vDLPUWvPtaTaGohSxbBuvMFnPeRkeutsDamZSfPE36r",
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
          sendMessageToParent({
            type: "show_wallet",
            windowName: "default-window",
          });
          setShowWalletView(true);
          break;
        default:
          console.log("Unhandled message type:", event.data.type);
      }
    };

    window.addEventListener("message", handleMessage);

    // Send initial ready message once
    sendMessageToParent({
      type: "ready",
    });

    return () => window.removeEventListener("message", handleMessage);
  }, []);
  const handleGoogleLogin = () => {
    console.log("Initiating Google login");
    sendMessageToParent({
      type: "public_key",
      windowName: "",
      publicKey: "7vDLPUWvPtaTaGohSxbBuvMFnPeRkeutsDamZSfPE36r",
    });
  };

  return showWalletView ? (
    <>
      {console.log("Rendering WalletOverview, showWalletView:", showWalletView)}
      <WalletOverview />
    </>
  ) : (
    <>
      {console.log("Rendering Dialog, showWalletView:", showWalletView)}
      <Dialog defaultOpen={true}>
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
              onClick={handleGoogleLogin}
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
    </>
  );
}
