"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "./wallet-provider"
import { ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function HeroSection() {
  const { isConnected } = useWallet()
  const { toast } = useToast()

  const handleGetStarted = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to get started.",
        variant: "destructive",
      })
    }
  }

  return (
    <section className="grid md:grid-cols-2 gap-12 items-center py-12">
      <div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          We make <span className="text-orange-500">progress</span> on crypto way
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The first decentralized fantasy sports betting platform with automated market making. Bet on your favorite
          teams with USDC and SOL.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleGetStarted} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" className="px-8 py-6 text-lg">
            See How It Works
          </Button>
        </div>
        <div className="mt-8 flex items-center space-x-2">
          <div className="bg-orange-100 text-orange-500 rounded-lg px-4 py-2 flex items-center">
            <span className="font-bold mr-1">$16.80</span>
            <span className="text-xs">USDC</span>
          </div>
          <div className="text-xs text-gray-500">
            Monthly
            <br />
            Average Win
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="bg-white rounded-2xl p-6 shadow-lg relative z-10">
          <img src="/sports-betting-app-screen.png" alt="Fantasy Sports Betting" className="rounded-lg w-full" />
          <div className="absolute -bottom-4 -right-4 bg-yellow-200 text-gray-800 rounded-xl px-4 py-2 shadow-md">
            <p className="font-medium">DID YOU CATCH THAT?</p>
          </div>
        </div>
        <div className="absolute top-8 -right-8 bg-black text-white rounded-xl px-4 py-2 shadow-md">
          <p className="font-medium">IT'S PERFECT TIME</p>
        </div>
        <div className="absolute -bottom-8 left-8 bg-gray-100 rounded-full p-4 shadow-md flex items-center justify-center">
          <span className="font-bold">24/7</span>
        </div>
      </div>
    </section>
  )
}
