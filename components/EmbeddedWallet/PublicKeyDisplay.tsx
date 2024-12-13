import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface PublicKeyDisplayProps {
  publicKey: string;
}

const PublicKeyDisplay: React.FC<PublicKeyDisplayProps> = ({ publicKey }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const truncateKey = (key: string): string => {
    if (key?.length <= 10) return key;
    return `${key?.slice(0, 4)}...${key?.slice(-4)}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer select-none"
      onClick={handleCopy}
    >
      <p className="text-sm text-gray-600">{truncateKey(publicKey)}</p>
      {copied ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <Copy size={16} className="text-gray-500 hover:text-blue-500" />
      )}
    </div>
  );
};

export default PublicKeyDisplay;
