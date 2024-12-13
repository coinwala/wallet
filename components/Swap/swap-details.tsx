"use client";

import { useState } from "react";
import { ChevronRight, Cog } from "lucide-react";

export default function SwapDetails() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-row justify-between pt-2">
      <div
        className="flex cursor-pointer select-none flex-row items-center text-grey-700 hover:opacity-80"
        onClick={() => setShowDetails(!showDetails)}
      >
        <ChevronRight
          className={`h-4 w-4 transition ${showDetails ? "rotate-90" : ""}`}
        />
        <p className="ml-1 text-xs font-semibold">View Swap Details</p>
      </div>
      <div className="flex min-w-max cursor-pointer flex-row items-center self-center text-grey-700 hover:opacity-80">
        <Cog className="mr-1 w-4" />
        <p className="gap-1 text-xs font-semibold">Settings</p>
      </div>
      {showDetails && (
        <div className="mt-2 w-full">
          {/* Add swap details here */}
          <p className="text-sm text-grey-600">
            Swap details will be shown here
          </p>
        </div>
      )}
    </div>
  );
}
