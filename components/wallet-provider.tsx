"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { getSolanaEndpoint, useSolanaWallets } from "@/lib/solana-wallet"
import { LAMPORTS_PER_SOL, Connection } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css"

interface WalletContextType {
  isConnected: boolean
  publicKey: string | null
  balance: {
    usdc: string
    sol: string
  }
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  placeBet: (amount: number, matchId: string, selection: string, odds: number) => Promise<boolean>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// USDC token address on Solana (this is the devnet address, use the mainnet address for production)
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

function WalletContextProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected, disconnect: solanaDisconnect, wallet } = useSolanaWallet()
  const [balance, setBalance] = useState({
    usdc: "0.00",
    sol: "0.00",
  })
  const { toast } = useToast()

  // Fetch SOL balance
  useEffect(() => {
    if (!publicKey) return

    const fetchSolBalance = async () => {
      try {
        const connection = new Connection(getSolanaEndpoint())
        const solBalance = await connection.getBalance(publicKey)
        setBalance((prev) => ({
          ...prev,
          sol: (solBalance / LAMPORTS_PER_SOL).toFixed(4),
        }))
      } catch (error) {
        console.error("Error fetching SOL balance:", error)
      }
    }

    // For demo purposes, we're also setting a mock USDC balance
    // In a real app, you would fetch the actual token balance
    const fetchUsdcBalance = async () => {
      // Mock USDC balance for demo
      // In a real app, you would use something like:
      // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: new PublicKey(USDC_MINT) })
      setBalance((prev) => ({
        ...prev,
        usdc: "1,450.75", // Mock value
      }))
    }

    fetchSolBalance()
    fetchUsdcBalance()

    // Set up interval to refresh balances
    const intervalId = setInterval(() => {
      fetchSolBalance()
      fetchUsdcBalance()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(intervalId)
  }, [publicKey])

  // Connect wallet - this is handled by the Solana wallet adapter
  const connect = async () => {
    // The actual connection is handled by the WalletMultiButton
    // This function is kept for API consistency
    if (!wallet) {
      toast({
        title: "Wallet Connection",
        description: "Please select a wallet to connect",
      })
      return
    }

    try {
      await wallet.adapter.connect()
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Disconnect wallet
  const disconnect = async () => {
    try {
      await solanaDisconnect()
      setBalance({
        usdc: "0.00",
        sol: "0.00",
      })
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Place a bet
  const placeBet = async (amount: number, matchId: string, selection: string, odds: number): Promise<boolean> => {
    if (!publicKey) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to place a bet.",
        variant: "destructive",
      })
      return false
    }

    // In a real app, you would create and send a transaction to a smart contract
    // For this demo, we'll simulate a successful bet
    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Bet Placed",
        description: `You've successfully placed a bet of $${amount} on ${selection} for match #${matchId}`,
      })

      // Update balance (simulated)
      setBalance((prev) => ({
        ...prev,
        usdc: (Number.parseFloat(prev.usdc.replace(/,/g, "")) - amount).toFixed(2),
      }))

      return true
    } catch (error) {
      console.error("Error placing bet:", error)
      toast({
        title: "Bet Failed",
        description: "Failed to place bet. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected: connected,
        publicKey: publicKey?.toString() || null,
        balance,
        connect,
        disconnect,
        placeBet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallets = useSolanaWallets()

  return (
    <ConnectionProvider endpoint={getSolanaEndpoint()}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
