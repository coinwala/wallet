import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NFTMetadata } from "@/lib/types";
import exp from "constants";
import Image from "next/image";

interface MetadataDialogProps {
  nft: NFTMetadata;
  isOpen: boolean;
  onClose: () => void;
}

const MetadataDialog = ({ nft, isOpen, onClose }: MetadataDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{nft.name} Metadata</span>
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
                className="rounded-lg"
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-500">
                Basic Info
              </h3>
              <div className="space-y-2 mt-2">
                <p>
                  <span className="font-medium">Name:</span> {nft.name}
                </p>
                <p>
                  <span className="font-medium">Symbol:</span> {nft.symbol}
                </p>
                <p className="break-all">
                  <span className="font-medium">Mint:</span> {nft.mint}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500">
                Properties
              </h3>
              <div className="space-y-2 mt-2">
                <p>
                  <span className="font-medium">Token Standard:</span>{" "}
                  {nft.tokenStandard ?? "N/A"}
                </p>
                <p>
                  <span className="font-medium">Mutable:</span>{" "}
                  {nft.isMutable ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-medium">Primary Sale:</span>{" "}
                  {nft.primarySaleHappened ? "Completed" : "Not Completed"}
                </p>
                <p>
                  <span className="font-medium">Seller Fee:</span>{" "}
                  {nft.sellerFeeBasisPoints
                    ? `${nft.sellerFeeBasisPoints / 100}%`
                    : "N/A"}
                </p>
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

            {nft.collection && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500">
                  Collection
                </h3>
                <div className="space-y-2 mt-2">
                  <p className="break-all">
                    <span className="font-medium">Address:</span>{" "}
                    {nft.collection.address}
                  </p>
                  <p>
                    <span className="font-medium">Verified:</span>{" "}
                    {nft.collection.verified ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-sm text-gray-500">URIs</h3>
              <div className="space-y-2 mt-2">
                <p className="break-all">
                  <span className="font-medium">Metadata URI:</span>{" "}
                  <a
                    href={nft.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {nft.uri}
                  </a>
                </p>
                {nft.image && (
                  <p className="break-all">
                    <span className="font-medium">Image URI:</span>{" "}
                    <a
                      href={nft.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      {nft.image}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetadataDialog;
