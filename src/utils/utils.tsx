import { PublicKey } from "@solana/web3.js";

export function getExplorerUrl(
  viewTypeOrItemAddress: "inspector" | PublicKey | string
) {
  return `https://solscan.io/tx/${viewTypeOrItemAddress}?cluster=devnet`;
}

export const isBase58 = (value: string): boolean =>
  /^[A-HJ-NP-Za-km-z1-9]*$/.test(value);
