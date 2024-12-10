"use client";
import { animate } from "framer-motion";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import usdclogo from "./../public/assets/images/images/usdc_logo.svg";
import wrappedbitcoinlogo from "./../public/assets/images/images/wrappedbitcoinlogo.png";

export function CardDemo() {
  return (
    <div>
      <Skeleton />
    </div>
  );
}

const Skeleton = () => {
  const scale = [1, 1.1, 1];
  const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
  const sequence = [
    [
      ".circle-1",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-2",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-3",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-4",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-5",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ];

  useEffect(() => {
    animate(sequence, {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'duration' does not exist on type 'never'.
      repeat: Infinity,
      repeatDelay: 1,
    });
  }, []);
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row flex-shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <BonkLogo className="h-4 w-4 " />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <UsdcLogo className="h-6 w-6 dark:text-white" />
        </Container>
        <Container className="circle-3">
          <SolanaLogo className="h-8 w-8 dark:text-white" />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <UsdtLogo className="h-6 w-6 " />
        </Container>
        <Container className="h-8 w-8 circle-5">
          <GeminiLogo className="h-4 w-4 " />
        </Container>
      </div>
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-800 dark:text-white py-2",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-[15rem] md:h-[20rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};

export const BonkLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="CIRCLE_OUTLINE_BLACK"
      viewBox="0 0 512 512"
      className={className}
    >
      <circle cx="256" cy="256" r="255.99999" fill="#fdde00" />
      <path
        d="m131.38959,180.995s-13.237,16.66882-8.82467,92.16875c0,0-28.9253,74.02915-19.12011,111.77912s48.04541,35.78893,48.04541,35.78893c0,0,61.28241,53.92852,108.3473,6.37337,47.06489-47.55515-39.22074-231.89264-39.22074-231.89264l-10.7857-63.73371s-11.76622,9.31493-10.29545,70.59734c1.47078,61.28241-24.02271,18.13959-24.02271,18.13959l-44.12334-39.22074Z"
        fill="#3c2d0c"
      />
      <path
        d="m136.29219,247.67027l-16.17856,45.59411-5.88311,31.86685s-20.10063,71.0876,62.75319,70.10708c0,0,64.71423,57.8506,106.87653,19.12011l11.27596-12.25648,19.61037-30.39608,32.35711-96.58108s-10.29545-66.185-75.49993-93.63952c0,0-5.39285-2.94156-15.19804.98052,0,0-26.96426-60.79215-44.12334-53.43826,0,0-14.70778,7.84415-1.96104,67.65578l-23.04219,10.29545s-25.20351-47.7852-48.53567-38.24022c-21.57141,8.82467-2.4513,78.93175-2.4513,78.93175Z"
        fill="#e78c19"
      />
      <path
        d="m220.12652,158.93334l1.96104,26.474s1.47078,15.19804,17.64937,9.80517c4.57253-1.52419,8.58869-4.70871,8.16586-9.93588-.31661-3.91404-3.04984-7.45769-4.82791-10.83438-3.32906-6.32212-5.99567-13.03075-9.86694-19.05272-1.98122-3.09198-6.05921-10.00957-10.63012-9.20294,0,0-3.37053-.98052-2.4513,12.74674Z"
        fill="#efb99d"
      />
      <path
        d="m149.2535,188.65525c.30914-.20238,6.89548-8.54693,20.5908,11.67436,13.69662,20.2232,12.31776,17.55741,12.31776,17.55741,0,0,7.35388,8.08927-7.72159,18.47665-3.34936,2.30779-6.81851,4.57013-10.66621,5.95937-2.33195.84194-4.91964,1.53939-7.41838,1.42042-2.8616-.13625-4.15006-1.59795-4.85701-4.29096-2.3167-8.82509-4.92653-17.60208-6.24897-26.64485-.99689-6.81672-2.98856-19.57488,4.00359-24.1524Z"
        fill="#efb99d"
      />
      <path
        d="m308.47437,229.40138c0,4.80604-7.02592,8.7021-15.69284,8.7021s-15.69284-3.89606-15.69284-8.7021,7.17442-11.88206,15.84134-11.88206,15.54434,7.07602,15.54434,11.88206Z"
        fill="#fbfbfb"
      />
      <ellipse
        cx="208.43967"
        cy="261.53786"
        rx="17.1433"
        ry="10.95428"
        transform="translate(-121.83855 314.12531) rotate(-60.49275)"
        fill="#fbfbfb"
      />
      <path
        d="m240.22716,306.74651l42.89769-22.3068s53.43826-27.94478,66.43013-6.37337c12.99187,21.57141,0,54.41878,0,54.41878,0,0-5.63798,38.48535-44.85873,41.91717l-21.08115,2.94156-26.96426.73539s-43.38795,2.4513-75.2548-21.08115l-10.05032-12.25648s-20.34576-27.94478-6.12824-48.04541c14.21752-20.10063,62.75319,11.03083,62.75319,11.03083,0,0,6.6185,3.43182,12.25648-.98052Z"
        fill="#fbfbfb"
      />
      <circle cx="337.54363" cy="185.16221" r="10.29545" fill="#e72d36" />
      <circle cx="314.74657" cy="159.91386" r="10.29545" fill="#e72d36" />
      <circle cx="278.22225" cy="151.82458" r="10.29545" fill="#e72d36" />
      <path
        d="m286.31153,78.77594c2.20617,30.39608-2.18177,57.8506-9.56006,57.8506s-17.15908-29.66069-17.15908-57.8506c0-11.6428,6.10385-13.48213,13.48213-13.48213s12.39418,1.86988,13.237,13.48213Z"
        fill="#e72d36"
      />
      <path
        d="m354.51511,97.74653c-11.21011,28.33708-27.08358,51.16197-33.73058,47.95898-6.647-3.203-2.58008-34.16591,9.65965-59.55805,5.05516-10.48729,11.35266-9.49432,17.99967-6.29133s10.35388,7.06475,6.07127,17.8904Z"
        fill="#e72d36"
      />
      <path
        d="m403.26341,152.86098c-24.67556,17.90384-50.326,28.65182-54.21464,22.38059s16.16969-30.22538,40.13262-45.0907c9.897-6.13957,14.6775-1.9215,18.56614,4.34973s4.94271,11.52056-4.48413,18.36038Z"
        fill="#e72d36"
      />
      <path d="m238.1967,276.83744c-.92483.07189-1.82335.18831-2.69206.33904.10366.31493.1708.63634.1708.96611,0,3.13789-4.87857,5.69464-11.01997,5.86671-.04082.26437-.0596.53013-.03884.79775.29475,3.79604,6.85265,6.38293,14.64741,5.77766,7.79488-.60527,13.87482-4.17335,13.58007-7.96962-.29475-3.79604-6.85253-6.38293-14.64741-5.77766Z" />
      <path d="m292.43164,263.41659c-.92483.07189-1.82335.18831-2.69206.33904.10366.31493.1708.63634.1708.96611,0,3.13789-4.87857,5.69464-11.01997,5.86671-.04082.26437-.0596.53013-.03884.79775.29475,3.79604,6.85265,6.38293,14.64741,5.77766,7.79488-.60527,13.87482-4.17335,13.58007-7.96962-.29475-3.79604-6.85253-6.38293-14.64741-5.77766Z" />
      <path d="m310.21167,279.29199s-21.51013,6.25081-20.2232,18.38472c1.28693,12.13392,27.20939,18.38472,27.20939,18.38472,0,0,6.98619,2.75771,11.03083-3.86079,4.04464-6.6185,9.92775-15.62701,8.27313-28.49632,0,0-.55154-9.56006-26.29015-4.41233Z" />
    </svg>
  );
};

export const SolanaLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 101 88"
      fill="none"
      className={className}
    >
      <path
        d="M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z"
        fill="url(#paint0_linear_174_4403)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_174_4403"
          x1="8.52558"
          y1="90.0973"
          x2="88.9933"
          y2="-3.01622"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.08" stopColor="#9945FF" />
          <stop offset="0.3" stopColor="#8752F3" />
          <stop offset="0.5" stopColor="#5497D5" />
          <stop offset="0.6" stopColor="#43B4CA" />
          <stop offset="0.72" stopColor="#28E0B9" />
          <stop offset="0.97" stopColor="#19FB9B" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export const GeminiLogo = ({ className }: { className?: string }) => {
  return (
    <>
      <Image
        src={wrappedbitcoinlogo}
        alt="wrappedbitcoinlogo"
        className={className}
      />
    </>
  );
};
export const UsdcLogo = ({ className }: { className?: string }) => {
  return (
    <div>
      <Image src={usdclogo} alt="usdclogo" className={className} />
    </div>
  );
};

export const UsdtLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 2000 1750"
    >
      <path
        fill="#53ae94"
        d="M1632.3 0 367.7 0 0 785.98 1000 1750 2000 785.98 1632.3 0z"
      />
      <path
        d="M1138.88,626.12V473.58H1487.7V241.17H537.87V473.58H886.72V626C603.2,639,390,695.17,390,762.43S603.3,885.85,886.72,899v488.59H1139V898.91c283-13.06,495.75-69.17,495.75-136.38S1422,639.22,1139,626.16m0,231.37v-.13c-7.11.45-43.68,2.65-125.09,2.65-65.09,0-110.89-1.85-127-2.69v.21C636.36,846.47,449.4,802.85,449.4,750.66s187-95.75,437.44-106.86V814.11c16.41,1.13,63.33,3.9,128.09,3.9,77.79,0,116.9-3.24,124.07-3.9V643.8c250,11.13,436.53,54.79,436.53,106.8S1388.91,846.29,1139,857.42"
        fill="#fff"
      />
    </svg>
  );
};
