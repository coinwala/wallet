import { ALLOWED_ORIGINS } from "./constants";
import { AllowedOrigin } from "./types";

export const isAllowedOrigin = (origin: string): origin is AllowedOrigin => {
    return ALLOWED_ORIGINS.includes(origin as AllowedOrigin);
  };
  
  export const createMessageId = (type: string, timestamp: number = Date.now()) => {
    return `${type}-${timestamp}`;
  };