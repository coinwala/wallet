import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowRightLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
} from "lucide-react";

const WalletOverview = () => {
  console.log("hereeee");
  const [balance, setBalance] = useState("1.234");
  const [currency, setCurrency] = useState("SOL");

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-black !important">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Wallet</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <X className="h-5 w-5" />
        </button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm text-gray-500">
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{balance}</span>
            <span className="ml-2 text-lg">{currency}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center p-4 h-auto"
        >
          <ArrowDownToLine className="h-6 w-6 mb-2" />
          <span className="text-sm">Deposit</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center p-4 h-auto"
        >
          <ArrowRightLeft className="h-6 w-6 mb-2" />
          <span className="text-sm">Swap</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center p-4 h-auto"
        >
          <ArrowUpFromLine className="h-6 w-6 mb-2" />
          <span className="text-sm">Send</span>
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="text-center text-gray-500 py-8">
          No recent transactions
        </div>
      </div>
    </div>
  );
};

export default WalletOverview;
