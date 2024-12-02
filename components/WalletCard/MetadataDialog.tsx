import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NFTMetadata } from "@/lib/types";
import exp from "constants";
import Image from "next/image";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

interface MetadataDialogProps {
  nft: NFTMetadata;
  isOpen: boolean;
  onClose: () => void;
}

const MetadataDialog = ({ nft, isOpen, onClose }: MetadataDialogProps) => {
  console.log(nft);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex justify-between w-full px-4">
              <div className="flex items-center ">
                <span>{nft.name}</span>
              </div>

              <div>
                <Button>
                  <Send />
                  Send
                </Button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            {nft.image && (
              <Image
                src={nft.image}
                alt={nft.name}
                width={300}
                height={300}
                className="rounded-xl  shadow-md"
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div>
                {nft?.collection && (
                  <span>
                    <span className="text-gray-500 text-md">Collection</span>
                    <span>{nft?.collection?.verified}</span>
                  </span>
                )}
              </div>
              <div className="space-y-2 mt-2">
                {nft?.symbol && (
                  <span className="font-medium flex flex-col">
                    <span className="text-gray-500 text-md">Symbol</span>
                    <span className="text-md">{nft?.symbol}</span>
                  </span>
                )}
                {nft?.json?.description && (
                  <span className="font-medium flex flex-col">
                    <span className="text-gray-500 text-md">Description</span>
                    <span className="text-md">{nft?.json?.description}</span>
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500">
                Properties
              </h3>
              <div className="flex  space-y-2 mt-2">
                <div className="flex flex-col items-start justify-start gap-1 rounded bg-grey-50 px-[12px] py-[8px] text-xs font-semibold">
                  <h3 className="break-all capitalize text-gray-400"> Style</h3>
                  <p className="break-all capitalize text-gray-700">
                    {nft.model}
                  </p>
                </div>
              </div>
            </div>

            {nft.creators && nft.creators.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500">
                  Creators
                </h3>
                <div className="space-y-2 mt-2">
                  {nft.creators.map((creator, index) => (
                    <p key={index} className="break-all">
                      <span className="font-medium">Creator {index + 1}:</span>{" "}
                      {creator.address}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetadataDialog;
