"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Book,
  ChevronDown,
  Settings,
  Globe,
  Zap,
  LucideIcon,
  Code,
  Newspaper,
  MessageCircle,
} from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Logo from "../icons/Logo";
import SignIn from "../auth/signin-button";
import { useWallet } from "@solana/wallet-adapter-react";

interface SubMenuItem {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
}

interface NavMenuItem {
  label: string;
  icon: LucideIcon;
  submenu?: SubMenuItem[];
}

const NavbarDesktop = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { connected } = useWallet();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems: NavMenuItem[] = [
    {
      label: "Products",
      icon: Zap,
      submenu: [
        {
          title: "Dwalto Wallet",
          description: "Non-custodial Solana wallet",
          href: "/products/wallet",
          icon: Wallet,
        },
        {
          title: "Dwalto Wallet Adapter",
          description: "Seamless blockchain integration",
          href: "/products/dwalto-wallet-adapter",
          icon: Globe,
        },
      ],
    },
    {
      label: "Developers",
      icon: Book,
      submenu: [
        {
          title: "Documentation",
          href: "/docs",
          description: "Comprehensive guides",
          icon: Book,
        },
        {
          title: "API References",
          href: "/api",
          description: "Detailed technical specs",
          icon: Code,
        },
      ],
    },
    {
      label: "Resources",
      icon: Settings,
      submenu: [
        {
          title: "Blog",
          href: "/blog",
          description: "Latest insights",
          icon: Newspaper,
        },
      ],
    },
    {
      label: "FAQ",
      icon: MessageCircle,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-black/80 text-white backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center justify-between">
              <div className="flex items-center">
                <Logo />
              </div>

              <div
                className="flex items-center space-x-6"
                onMouseLeave={() => setActiveMenu(null)}
              >
                {menuItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveMenu(item.label)}
                  >
                    <button className="flex items-center text-sm font-medium hover:text-blue-600 transition-colors">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                      {item.submenu && (
                        <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                      )}
                    </button>
                    {item.submenu && (
                      <AnimatePresence>
                        {activeMenu === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-4 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 p-4"
                          >
                            {item.submenu &&
                              item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.title}
                                  href={subitem.href}
                                  className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                                >
                                  {subitem.icon ? (
                                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md mr-3 flex items-center justify-center">
                                      <subitem.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                    </div>
                                  ) : (
                                    <div className="w-10 mr-3" />
                                  )}
                                  <div className="flex flex-col justify-center">
                                    <p className="font-semibold text-black text-sm group-hover:text-blue-600 leading-tight">
                                      {subitem.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                      {subitem.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-1 rounded-lg">
                  <div>
                    <WalletMultiButton
                      style={{
                        backgroundColor: "rgb(255 255 255 / 0.1)",
                        height: "48px",
                        borderRadius: "10px",
                      }}
                    >
                      {!connected && <Wallet />}
                    </WalletMultiButton>
                  </div>
                </div>
                <SignIn />
              </div>
            </nav>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default NavbarDesktop;
