import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function createB64Referrer(clientId: string, url: string): string {
  const referrerUrl = sanitizeUrlForAllowList(url);
  const data = JSON.stringify({ clientId, referrerUrl });
  return Buffer.from(data).toString("base64");
}
function sanitizeUrlForAllowList(urlString: string): string {
  try {
    const url = new URL(urlString);
    const { protocol, hostname, port } = url;
    return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
  } catch (error) {
    console.error("Invalid URL:", error);
    throw new Error("Invalid URL format");
  }
}
