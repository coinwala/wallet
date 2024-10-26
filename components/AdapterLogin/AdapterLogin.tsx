"use client";
import React, { useEffect, useState, useTransition } from "react";
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
const verifier = process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER ?? "";
export default function AdapterLogin({ session }: UserInfoProps) {
  const [isPending, startTransition] = useTransition();
  const [hasVisited, setHasVisited] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Check if running in browser and get visit status
    if (typeof window !== "undefined") {
      const visitStatus = sessionStorage.getItem("hasVisited");

      if (!visitStatus) {
        // If first visit, set the flag and trigger sign in
        sessionStorage.setItem("hasVisited", "true");
        setHasVisited(true);
        startTransition(() => {
          signInAction();
        });
      } else {
        // If already visited, just update state
        setHasVisited(true);
      }
    }
  }, []);
  useEffect(() => {
    const initWeb3Auth = async () => {
      if (!session) {
        startTransition(() => {
          signInAction();
        });
        return;
      }
      try {
        if (web3auth.status === "not_ready") {
          await web3auth.init();
        }
        if (web3auth.status === "connected") {
          setProvider(web3auth.provider);
        } else if (session?.idToken) {
          const { payload } = decodeToken(session.idToken);
          const w3aProvider = await web3auth.connect({
            verifier,
            verifierId: (payload as any).email,
            idToken: session.idToken,
          });
          setProvider(w3aProvider);
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
      } finally {
      }
    };

    initWeb3Auth();
  }, [session]);

  useEffect(() => {
    const getPublicKey = async () => {
      if (provider) {
        try {
          const accounts = await provider.request({ method: "getAccounts" });
          if (Array.isArray(accounts) && accounts.length > 0) {
            setPublicKey(accounts[0]);
          }
        } catch (error) {
          console.error("Error fetching public key:", error);
          setError("Failed to retrieve public key.");
        }
      }
    };

    getPublicKey();
  }, [provider]);
  console.log(publicKey);
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
