"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa6";
interface TipLinkMessageEvent extends MessageEvent {
  data: {
    type: string;
    title?: string;
    dAppSessionId?: string;
    tipLinkSessionId?: string;
  };
}
const Modal = () => {
  const handleGoogleLogin = () => {
    window.open("/embedded_adapter_login", "_blank", "noopener,noreferrer");
  };
  useEffect(() => {
    // Set up iframe for connection and configure postMessage listeners
    const setupTipLinkConnection = () => {
      const iframe = document.createElement("iframe");

      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const messageHandler = (event: TipLinkMessageEvent) => {
        // Verify the message origin to ensure it's from TipLink
        console.log("reached1");
        const { type } = event.data;
        console.log("reached");
        // Handle messages from TipLink iframe
        if (type === "ready") {
          console.log("TipLink iframe is ready for connection");
        } else if (type === "ack") {
          console.log("Acknowledged connection with TipLink");
          // Redirect or perform another action on successful connection
        }
      };

      // Attach the event listener for message events from the iframe
      window.addEventListener("message", messageHandler as EventListener);

      iframe.onload = () => {
        console.log("TipLink iframe loaded");
        iframe.contentWindow?.postMessage(
          { type: "initiate_connection" },
          "http://localhost:3000"
        );
      };

      // Cleanup on component unmount
      return () => {
        window.removeEventListener("message", messageHandler as EventListener);
        document.body.removeChild(iframe);
      };
    };

    setupTipLinkConnection();
  }, []);
  return (
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
  );
};

export default Modal;
