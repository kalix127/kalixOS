import type { WifiNetwork } from "@/types";

export const defaultNetworks: WifiNetwork[] = [
  { id: 1, name: "TIM-7632798", signal: 4, isProtected: true },
  { id: 2, name: "FASTWEB-1234567", signal: 4, isProtected: true },
  { id: 3, name: "TIM-34781 Public", signal: 3, isProtected: false },
  { id: 4, name: "FASTWEB-9876543", signal: 3, isProtected: true },
  { id: 5, name: "VODAFONE-72624", signal: 3, isProtected: true },
  { id: 6, name: "TIM-27834", signal: 2, isProtected: true },
  { id: 7, name: "VODAFONE Public", signal: 2, isProtected: false },
  { id: 8, name: "ILIAD-528937", signal: 1, isProtected: true },
];
