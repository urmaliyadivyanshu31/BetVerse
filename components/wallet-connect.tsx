"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "./wallet-provider"
import { Wallet } from "lucide-react"

interface WalletConnectProps {
  onConnect?: () => void
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const { isConnected, connect } = useWallet()

  const handleConnect = async () => {
    await connect()
    if (onConnect) onConnect()
  }

  return (
    <div className="wallet-adapter-wrapper">
      <WalletMultiButton
        className="wallet-adapter-button custom-wallet-button"
        startIcon={<Wallet className="mr-2 h-4 w-4" />}
      />
    </div>
  )
}
