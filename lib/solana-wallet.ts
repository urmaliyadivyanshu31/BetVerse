"use client"

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react"

export const SOLANA_NETWORK = WalletAdapterNetwork.Devnet // Change to Mainnet for production

export const getSolanaEndpoint = () => clusterApiUrl(SOLANA_NETWORK)

export function useSolanaWallets() {
  return useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()], [])
}
