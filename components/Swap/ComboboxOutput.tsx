"use client";

import * as React from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  MoveUpRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Token, TokenWithBalance } from "@/lib/types";

interface ComboboxProps {
  tokens: Token[] | null | undefined;
  defaultToken?: string; // Optional prop to set default token
  onTokenSelect?: (token: TokenWithBalance | undefined) => void; // Optional callback for token selection
}

export function ComboboxOutput({
  tokens,
  defaultToken = "USDC",
  onTokenSelect,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultToken);

  React.useEffect(() => {
    if (tokens) {
      const defaultTokenExists = tokens.some(
        (token) => token.symbol === defaultToken
      );
      if (!defaultTokenExists) {
        setValue(tokens[0].symbol);
      }
    }
  }, [tokens, defaultToken]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    console.log(newValue);
    setValue(newValue);
    setOpen(false);
    // if (onTokenSelect && newValue) {
    //   onTokenSelect(tokens?.find((token) => token.symbol === newValue));
    // }
  };
  function truncateAddress(
    address: string,
    startChars: number = 4,
    endChars: number = 4
  ): string {
    if (address.length <= startChars + endChars) {
      return address;
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }

  const selectedToken = tokens?.find((token) => token.symbol === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedToken ? (
            <div className="flex gap-1 items-center">
              <img
                loading="lazy"
                height={20}
                width={20}
                src={selectedToken.logoURI}
                alt={`${selectedToken.name} logo`}
                className="rounded-full"
              />
              {selectedToken.symbol}
            </div>
          ) : (
            "Select Token..."
          )}
          {open ? (
            <ChevronUp className="opacity-50" />
          ) : (
            <ChevronDown className="opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
        <Command>
          <CommandInput placeholder="Search tokens..." />
          <CommandList>
            <CommandEmpty>No tokens found.</CommandEmpty>
            {selectedToken && (
              <CommandItem>
                <div className="flex gap-2 items-center w-full">
                  <img
                    height={20}
                    width={20}
                    src={selectedToken?.logoURI}
                    alt={`${selectedToken?.name} logo`}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{selectedToken?.name}</span>
                    <span className="text-muted-foreground text-xs flex items-center ">
                      <p>{selectedToken?.symbol}</p>

                      <p className=" flex gap-1 !ml-2 !min-h-fit !p-1 !text-[10px] !leading-none bg-gray-300  !text-grey-700 rounded-lg">
                        {" "}
                        {truncateAddress(
                          selectedToken?.address?.toString() || ""
                        )}
                        <ArrowUpRight className="h-[10px] w-[15px] " />
                      </p>
                    </span>
                  </div>
                </div>
              </CommandItem>
            )}
            <CommandItem>
              <p className="text-gray-700 sticky top-9 z-[100001] border-b border-t border-grey-100 bg-white px-4 pb-2 pt-2 text-xs font-bold text-grey-700">
                VERIFIED TOKENS
              </p>
            </CommandItem>
            <CommandGroup>
              {tokens?.map((token) => (
                <CommandItem
                  key={token.address}
                  value={token.symbol}
                  onSelect={handleSelect}
                  className={cn("flex gap-2 items-center")}
                >
                  <div className="flex gap-2 items-center w-full">
                    <img
                      height={20}
                      width={20}
                      src={token.logoURI}
                      alt={`${token.name} logo`}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{token.name}</span>
                      <span className="text-muted-foreground text-xs flex items-center ">
                        <p>{token?.symbol}</p>

                        <p className=" flex gap-1 !ml-2 !min-h-fit !p-1 !text-[10px] !leading-none bg-gray-300  !text-grey-700 rounded-lg">
                          {" "}
                          {truncateAddress(
                            selectedToken?.address?.toString() || ""
                          )}
                          <ArrowUpRight className="h-[10px] w-[15px] " />
                        </p>
                      </span>
                    </div>
                    {value === token.symbol && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
