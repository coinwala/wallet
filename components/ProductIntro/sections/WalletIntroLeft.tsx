import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Send, Wallet, ArrowRightLeft, Plus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
const actions = [
  {
    title: "Send/Pay",
    icon: Send,
    color: "bg-gray-800",
  },
  {
    title: "Withdraw",
    icon: Wallet,
    color: "bg-gray-700",
  },
  {
    title: "Buy",
    icon: Plus,
    color: "bg-gray-900",
  },
  {
    title: "Swap",
    icon: ArrowRightLeft,
    color: "bg-gray-600",
  },
];

export default function WalletIntroLeft() {
  return (
    <div className="w-full md:w-1/2 flex justify-center items-center p-8">
      <Card className="bg-white border-gray-200 shadow-lg w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="text-2xl font-bold">$$$ USD</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div
                    className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-medium">{action.title}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="h-12 bg-gray-100 rounded-lg" />
            <div className="h-12 bg-gray-100 rounded-lg" />
            <div className="h-12 bg-gray-100 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
