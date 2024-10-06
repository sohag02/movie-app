import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(mins: number): string {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}
