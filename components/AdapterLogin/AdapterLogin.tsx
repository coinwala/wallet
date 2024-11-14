"use client";
import React, { useEffect, useState, useTransition, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { Session } from "next-auth";
import { signInAction } from "@/lib/signInAction";
import { decodeToken, web3auth } from "@/lib/web3auth";
import { initClients } from "@/lib/client";
import { handleSignOut } from "@/actions";

type UserInfoProps = {
  session: Session | null;
};

type MessagePayload = {
  type: string;
  windowName: string;
  publicKey: string;
  timestamp?: number;
};

// Enhanced message sender with proper origin handling
const sendMessageToParent = (message: MessagePayload) => {
  if (!window.opener) {
    console.error("No parent window found");
    return;
  }

  const enrichedMessage = {
    ...message,
    timestamp: Date.now(),
  };

  const isDevelopment = process.env.NODE_ENV === "development";
  const developmentOrigins = ["http://localhost:3000", "http://localhost:3001"];
  const productionOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS
    ? JSON.parse(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS)
    : ["https://yourdomain.com"]; // Replace with your production domains

  const originsToTry = isDevelopment ? developmentOrigins : productionOrigins;

  // Try sending to each allowed origin
  let messageSent = false;
  for (const origin of originsToTry) {
    try {
      window.opener.postMessage(enrichedMessage, origin);
      console.log(`Successfully sent message to ${origin}:`, enrichedMessage);
      messageSent = true;
      break;
    } catch (err) {
      console.warn(`Failed to send to ${origin}:`, err);
    }
  }

  if (!messageSent) {
    console.error("Failed to send message to any allowed origin");
  }
};

const VISIT_KEY = "has_visited_adapter";
const SIGN_IN_KEY = "has_signed_in";
const verifier = process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER ?? "";

export default function AdapterLogin({ session }: UserInfoProps) {
  const [isPending, startTransition] = useTransition();
  const [hasVisited, setHasVisited] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasSignedIn = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasAlreadySignedIn = sessionStorage.getItem(SIGN_IN_KEY) === "true";

    if (!hasAlreadySignedIn && !hasSignedIn.current) {
      hasSignedIn.current = true;
      sessionStorage.setItem(SIGN_IN_KEY, "true");

      const visitStatus = localStorage.getItem(VISIT_KEY);
      if (!visitStatus) {
        localStorage.setItem(VISIT_KEY, "true");
      }

      setHasVisited(true);
      startTransition(() => {
        signInAction();
      });
    }
  }, []);

  // Enhanced effect to get public key with retry mechanism
  useEffect(() => {
    const getPublicKey = async () => {
      if (provider) {
        try {
          const accounts = await provider.request({ method: "getAccounts" });
          if (Array.isArray(accounts) && accounts.length > 0) {
            const publicKeyString = accounts[0];
            setPublicKey(publicKeyString);
            localStorage.setItem("publicKey", publicKeyString);

            // Send public key with retry mechanism
            const message = {
              type: "login_success", // Changed type to be more specific
              windowName: "default-window",
              publicKey: publicKeyString,
            };

            sendMessageToParent(message);

            // Set visit status and close window after a short delay
            sessionStorage.setItem(VISIT_KEY, "true");
            setTimeout(() => {
              window.close();
            }, 1000); // Give time for the message to be sent
          }
        } catch (error) {
          console.error("Error fetching public key:", error);
          setError("Failed to retrieve public key.");
        }
      }
    };

    getPublicKey();
  }, [provider]);

  // Handle web3auth initialization
  useEffect(() => {
    const initWeb3Auth = async () => {
      if (!session?.idToken) return;

      try {
        if (web3auth.status === "not_ready") {
          await web3auth.init();
        }

        if (web3auth.status === "connected") {
          setProvider(web3auth.provider);
        } else {
          const { payload } = decodeToken(session.idToken);
          const w3aProvider = await web3auth.connect({
            verifier,
            verifierId: (payload as any).email,
            idToken: session.idToken,
          });
          setProvider(w3aProvider);
          localStorage.setItem("provider", JSON.stringify(w3aProvider));
          initClients();
        }
      } catch (e) {
        console.error("Error initializing & connecting to web3auth:", e);
        if (
          e instanceof Error &&
          (e.message.includes("Duplicate token found") ||
            e.message.includes("Wallet is not connected"))
        ) {
          setError(
            "Session expired or wallet disconnected. Please sign in again."
          );
          await handleSignOut();
        } else {
          setError("An error occurred. Please try again.");
        }
        setProvider(null);
        setPublicKey(null);
      }
    };

    initWeb3Auth();
  }, [session]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black dark:bg-gray-950">
      <div className="mt-[-60px] flex w-full max-w-screen-xl items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center justify-center h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full bg-gray-100">
          <Image
            alt="logo"
            height={50}
            width={50}
            src="/icons/logo.png"
            className="object-contain"
            priority
          />
        </div>

        <div className="flex items-center justify-center h-[50px] w-[50px] sm:h-[60px] sm:w-[60px]">
          {!isPending && (
            <DotLottieReact src="./lootie/DotAnimation.json" loop autoplay />
          )}
        </div>

        <div className="flex items-center justify-center h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full bg-gray-100">
          <Image
            alt="Google logo"
            height={40}
            width={40}
            src="/assets/images/images/GoogleLogo.png"
            className="object-contain p-1"
            priority
          />
        </div>
      </div>
    </div>
  );
}
