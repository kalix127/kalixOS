import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomDelays(
  count: number,
  totalTime: number,
): number[] {
  const randomNumbers = Array.from({ length: count }, () => Math.random());
  const sumOfRandoms = randomNumbers.reduce((acc, num) => acc + num, 0);
  // Normalize the random numbers so that their sum equals totalTime
  return randomNumbers.map(random => (random / sumOfRandoms) * totalTime);
}
