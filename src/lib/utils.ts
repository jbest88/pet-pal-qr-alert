
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | number) {
  try {
    const date = typeof dateString === 'number' 
      ? new Date(dateString) 
      : new Date(dateString);
    return format(date, "PPP 'at' p");
  } catch (e) {
    return "Unknown date";
  }
}

// Glass morphism utility class
export const glass = "backdrop-blur-md bg-white/30 border border-white/20 shadow-lg";
