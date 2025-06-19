import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string): string => name
  .split("")
  .map((item) => item)
  .join("")
  .toUpperCase()
  .slice(0, 2);