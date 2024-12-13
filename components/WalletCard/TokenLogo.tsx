"use client";
import React, { useState } from "react";
import Image from "next/image";

interface TokenLogoProps {
  src: string;
  alt: string;
}

const TokenLogo: React.FC<TokenLogoProps> = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={24}
      height={24}
      className="mr-2 rounded-full"
      onError={() => setImgSrc("/fallback-token-logo.png")}
    />
  );
};
export default TokenLogo;
