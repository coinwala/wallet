import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowRightLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const WalletOverview = () => {
  return (
    <Sheet defaultOpen={true}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Overview
          </SheetTitle>
          <SheetDescription>
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
            <Button variant="outline" className="w-full">
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
