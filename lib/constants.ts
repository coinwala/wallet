import { AllowedOrigin } from "./types";

export const ORIGIN_MAP: Record<string, AllowedOrigin> = {
    production: "http://localhost:3001",
    staging: "https://staging.tiplink.io",
    development: "https://dev.tiplink.io",
    adapter: "https://adapter.tiplink.io",
    local: "https://tiplink.io",
  } as const;
  
  export const ALLOWED_ORIGINS: AllowedOrigin[] = [
    ...Object.values(ORIGIN_MAP),
    "http://localhost:3000",
    "http://localhost:3001",
  ];