"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Wallet, ArrowRightLeft, Plus, ArrowRight } from "lucide-react";

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

export default function WalletIntro() {
  return (
    <div className="min-h-screen bg-white text-black w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-medium mb-6"
            >
              Dewlto WALLET
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              The world's simplest wallet
            </motion.h1>

            <motion.p
              className="text-xl text-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Create or login to your secured Dewlto wallet with just 2 clicks:
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button size="lg" variant="outline" className="text-black">
                Learn More
              </Button>
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800"
              >
                Continue via Google
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Wallet Preview */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
