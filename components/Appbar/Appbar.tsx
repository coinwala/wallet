"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "../icons/Logo";
import SignIn from "../auth/signin-button";
import { Menu as MenuIcon, PlugZap, Sparkles, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  useWalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

interface MenuItemProps {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({
  setActive,
  active,
  item,
  children,
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative py-2">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              {/* Invisible bridge to prevent gap */}
              <div className="h-4 w-full" />
              <motion.div
                transition={transition}
                layoutId="active"
                className=" bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

interface MenuProps {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-transparent bg-black dark:border-white/[0.2] bg-white shadow-input flex justify-center space-x-4 px-8 py-2"
    >
      {children}
    </nav>
  );
};

interface ProductItemProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  href,
  icon: Icon,
}) => {
  return (
    <Link
      href={href}
      className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </div>
      <div>
        <h4 className="text-sm font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-xs max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

interface HoveredLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

const HoveredLink: React.FC<HoveredLinkProps> = ({
  href,
  children,
  ...rest
}) => {
  return (
    <Link
      href={href ?? ""}
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors block"
    >
      {children}
    </Link>
  );
};

const Appbar: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { wallet, publicKey, connected } = useWallet();
  console.log("wallet", wallet, publicKey);
  const handleMouseEnter = (item: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActive(item);
  };

  return (
    <header className="w-full py-4 fixed top-0 left-0 right-0 bg-black z-50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between md:justify-start md:border md:p-2.5 rounded-xl max-w-2xl lg:max-w-4xl mx-auto md:bg-white/90 dark:md:bg-black/90 md:backdrop-blur-sm">
          <div className="flex items-center">
            <div className="border h-10 w-10 rounded-lg inline-flex items-center justify-center mr-4">
              <Logo className="h-8 w-8" fill="currentColor" />
            </div>
          </div>
          <nav className="hidden md:flex gap-4 lg:gap-8 text-sm flex-grow justify-center">
            <Menu setActive={setActive}>
              <MenuItem
                setActive={handleMouseEnter}
                active={active}
                item="Products"
              >
                <div className="flex flex-col space-y-4 min-w-[350px]">
                  <ProductItem
                    title="HyperLink wallet"
                    description="The world's simplest wallet"
                    href="/products/hyperlink-wallet-adapter"
                    icon={Wallet}
                  />
                  <ProductItem
                    title="HyperLink Wallet Adapter"
                    description="Make Solana apps consumer ready"
                    href="#"
                    icon={PlugZap}
                  />
                </div>
              </MenuItem>
              <MenuItem
                setActive={handleMouseEnter}
                active={active}
                item="API & Docs"
              >
                <div className="flex flex-col space-y-1">
                  <HoveredLink href="#">API Documentation</HoveredLink>
                  <HoveredLink href="#">Integration Guide</HoveredLink>
                  <HoveredLink href="#">SDK References</HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={handleMouseEnter} active={active} item="FAQ">
                <div className="flex flex-col space-y-1">
                  <HoveredLink href="#">General Questions</HoveredLink>
                  <HoveredLink href="#">Technical Support</HoveredLink>
                </div>
              </MenuItem>
              <MenuItem
                setActive={handleMouseEnter}
                active={active}
                item="Company"
              >
                <div className="flex flex-col space-y-1">
                  <HoveredLink href="#">About Us</HoveredLink>
                  <HoveredLink href="#">Careers</HoveredLink>
                  <HoveredLink href="#">Contact</HoveredLink>
                </div>
              </MenuItem>
              <MenuItem
                setActive={handleMouseEnter}
                active={active}
                item="Blogs"
              >
                <div className="flex flex-col space-y-1">
                  <HoveredLink href="#">Latest Posts</HoveredLink>
                  <HoveredLink href="#">Categories</HoveredLink>
                  <HoveredLink href="#">Archive</HoveredLink>
                </div>
              </MenuItem>
            </Menu>
          </nav>
          <div className="flex items-center gap-1">
            <div>
              <WalletMultiButton
                style={{ backgroundColor: "black", height: "48px" }}
              >
                {!connected && <Wallet />}
              </WalletMultiButton>
            </div>

            <SignIn />
            <button className="md:hidden ml-4">
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Appbar;
