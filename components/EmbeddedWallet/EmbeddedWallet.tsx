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

const useMessageHandler = () => {
  const parentOriginRef = useRef<string | null>(null);
  const processedMessages = useRef<Set<string>>(new Set());

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

    try {
      if (parentOriginRef.current && isAllowedOrigin(parentOriginRef.current)) {
        window.parent.postMessage(enrichedMessage, parentOriginRef.current);
        console.log(`Sent message to parent:`, enrichedMessage);
      } else {
        // Try each origin until one succeeds
        for (const origin of ALLOWED_ORIGINS) {
          try {
            window.parent.postMessage(enrichedMessage, origin);
            parentOriginRef.current = origin;
            console.log(`Sent message to ${origin}:`, enrichedMessage);
            break;
          } catch (err) {
            console.warn(`Failed to send to ${origin}:`, err);
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, []);

  return { sendMessageToParent, parentOriginRef, processedMessages };
};

const LoginDialog = ({ onGoogleLogin }: { onGoogleLogin: () => void }) => (
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

export default function EmbeddedWallet() {
  const [showWalletView, setShowWalletView] = useState(false);
  const { sendMessageToParent, parentOriginRef, processedMessages } =
    useMessageHandler();

  const handleMessage = useCallback(
    (event: MessageEvent<MessageData>) => {
      const origin = event.origin;

      if (!isAllowedOrigin(origin)) {
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
    },
    [sendMessageToParent]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("message", handleMessage);
    sendMessageToParent({ type: "ready" });

    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage, sendMessageToParent]);

  const handleGoogleLogin = useCallback(() => {
    console.log("Initiating Google login");
    sendMessageToParent({
      type: "public_key",
      windowName: "",
      publicKey: "7vDLPUWvPtaTaGohSxbBuvMFnPeRkeutsDamZSfPE36r",
    });
  }, [sendMessageToParent]);

  const handleWalletClose = useCallback(() => {
    setShowWalletView(false);
    console.log("hide_wallet");
    sendMessageToParent({
      type: "hide_wallet",
      windowName: "default-window",
    });
  }, [sendMessageToParent]);

  return showWalletView ? (
    <WalletOverview onClose={handleWalletClose} />
  ) : (
    <LoginDialog onGoogleLogin={handleGoogleLogin} />
  );
}
