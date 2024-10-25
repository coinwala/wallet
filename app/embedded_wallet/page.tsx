"use client";
import React, { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa6";
import { signIn } from "@/auth";
import { signInAction } from "@/lib/signInAction";

const Modal = () => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(() => {
      signInAction();
    });
  };
  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="!relative w-full bg-white px-8 pb-8 pt-10 dark:bg-grey-950 mobile:min-w-[390px] mobile:px-10 sm:max-w-[430px] rounded-xl shadow-lg">
        <div className="mx-auto flex flex-shrink-0 items-center justify-center ">
          <Image src="/icons/logo.png" alt="logo" width={90} height={90} />
        </div>

        <DialogHeader>
          <DialogTitle className="flex justify-center text-center my-3 text-[20px] font-bold leading-none text-grey-800 dark:text-grey-50 mobile:text-[24px]">
            Login to HyperLink
          </DialogTitle>
          <p className="mb-3 text-center text-xs text-grey-600 dark:text-grey-200 mobile:text-base">
            Click below to continue with your Google account.
          </p>
        </DialogHeader>

        <DialogFooter>
          <div className="flex w-full cursor-pointer flex-row justify-center">
            <div className="relative flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-black transition-colors duration-150 ease-linear ">
              <div className="absolute left-[3px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-white">
                <div className="flex items-center justify-center h-[22px] w-[22px]">
                  <FaGoogle className="h-5 w-5" />
                </div>
              </div>
              <div className="pl-7 ">
                <h3
                  className="font-bold text-white"
                  onClick={() => handleSubmit()}
                >
                  Login with Google
                </h3>
              </div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
