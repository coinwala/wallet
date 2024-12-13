import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  fill?: string;
}

const Logo: React.FC<LogoProps> = ({ className, fill }) => (
  <Link className="rounded-lg" href="/">
    <Image
      className="rounded-lg"
      src="/icons/Logo.png"
      alt="logo"
      width={180}
      height={100}
    />
  </Link>
);

export default Logo;
