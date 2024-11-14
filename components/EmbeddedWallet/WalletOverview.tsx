import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Session } from "next-auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface WalletOverviewProps {
  onClose?: () => void;
  showWalletView: boolean;
  session: Session | null;
}
const ENCRYPTION_KEY = "your_encryption_key";
const ENCRYPTION_VALUE = "your_encryption_value";
const WalletOverview = ({
  onClose,
  showWalletView,
  session,
}: WalletOverviewProps) => {
  const decrypted_session = (key: string, value: string) => {
    const encryptedSession = localStorage.getItem("session");
    if (!encryptedSession) return null;

    const decrypted = CryptoJS.AES.decrypt(
      encryptedSession,
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: CryptoJS.enc.Utf8.parse(value),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  };
  useEffect(() => {
    console.log("hello");
    console.log(decrypted_session(ENCRYPTION_KEY, ENCRYPTION_VALUE));
  }, [showWalletView]);

  return (
    <Sheet onOpenChange={onClose} open={showWalletView}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader className="mb-6">
          <SheetTitle>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-24 h-12 flex items-center justify-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="h-8 w-8  rounded-full">
                    <Avatar className="h-8 w-14 border-2 border-background">
                      <AvatarImage
                        src={"/icons/logo.png"}
                        alt="User avatar"
                        className="bg-gray-50 dark:bg-gray-800"
                      />
                    </Avatar>
                  </div>
                  <div className="h-8 w-8 overflow-hidden rounded-full">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage
                        src={
                          session?.user?.image ||
                          "https://via.placeholder.com/30"
                        }
                        alt="User avatar"
                        className="bg-gray-50 dark:bg-gray-800"
                      />
                    </Avatar>
                  </div>
                </div>
              </div>

              <span className="mt-2">Wallet Overview</span>
            </div>
          </SheetTitle>
          <SheetDescription className="flex items-center justify-center">
            Manage your wallet, send and receive funds
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.00 SOL</div>
              <p className="text-xs text-muted-foreground">≈ $0.00 USD</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full" variant="outline">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Receive
            </Button>
            <Button className="w-full" variant="outline">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-sm text-muted-foreground">
                No recent transactions
              </div>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default WalletOverview;
