import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge tailwind classes properly, avoiding style conflicts.
 * Based on the standard Shadcn UI approach.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
