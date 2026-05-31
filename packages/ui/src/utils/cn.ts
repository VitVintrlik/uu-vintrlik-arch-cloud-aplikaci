import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Robust utility for merging Tailwind CSS classes.
 * Combines 'clsx' for conditional classes and 'tailwind-merge' to resolve conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
