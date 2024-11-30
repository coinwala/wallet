"use client";

import { useTransition } from "react";
import { signInAction } from "@/lib/signInAction";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export default function LoginButton() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(() => {
      signInAction();
    });
  };

  return (
    <Button
      onClick={handleSubmit}
      disabled={isPending}
      className="flex items-center gap-2 px-[20px] py-[23px]"
    >
      {isPending ? "Logging in..." : "Login"}
      <FcGoogle />
    </Button>
  );
}
