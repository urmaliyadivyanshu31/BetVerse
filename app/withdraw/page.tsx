"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import { useWallet } from "@/components/wallet-provider"
import { ArrowRight, DollarSign, RefreshCw } from "lucide-react"

export default function WithdrawPage() {
  const { isConnected, balance } = useWallet()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("usdc")

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to withdraw funds.",
        variant: "destructive",
      })
      return
    }

    // Check if amount is valid
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    const currentBalance =
      activeTab === "usdc" ? Number.parseFloat(balance.usdc.replace(/,/g, "")) : Number.parseFloat(balance.sol)

    if (numAmount > currentBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${activeTab.toUpperCase()} to withdraw this amount.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Withdrawal Successful",
        description: `You've successfully withdrawn ${amount} ${activeTab.toUpperCase()} to your wallet.`,
      })

      setAmount("")
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      toast({
        title: "Transaction Failed",
        description: "Failed to withdraw funds. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const setMaxAmount = () => {
    if (activeTab === "usdc") {
      setAmount(balance.usdc.replace(/,/g, ""))
    } else {
      setAmount(balance.sol)
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Withdraw Funds</h1>
          <p className="text-gray-500 mb-8">Withdraw cryptocurrency to your connected wallet</p>

          {!isConnected ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 mb-4">Please connect your wallet to withdraw funds</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Withdraw your funds to your connected wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="usdc" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="usdc">USDC</TabsTrigger>
                    <TabsTrigger value="sol">SOL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="usdc">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Amount (USDC)</label>
                          <span className="text-sm text-gray-500">Balance: ${balance.usdc}</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="pl-9"
                              placeholder="0.00"
                            />
                          </div>
                          <Button variant="outline" onClick={setMaxAmount}>
                            Max
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-md">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Amount</span>
                          <span>${amount || "0.00"} USDC</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Network Fee</span>
                          <span>~$0.01</span>
                        </div>
                        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-medium">
                          <span>You will receive</span>
                          <span>${amount ? (Number.parseFloat(amount) - 0.01).toFixed(2) : "0.00"} USDC</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleWithdraw}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        disabled={!amount || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing
                          </>
                        ) : (
                          <>
                            Withdraw USDC <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="sol">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Amount (SOL)</label>
                          <span className="text-sm text-gray-500">Balance: {balance.sol} SOL</span>
                        </div>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                          />
                          <Button variant="outline" onClick={setMaxAmount}>
                            Max
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-md">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Amount</span>
                          <span>{amount || "0.00"} SOL</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Network Fee</span>
                          <span>~0.000005 SOL</span>
                        </div>
                        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-medium">
                          <span>You will receive</span>
                          <span>{amount ? (Number.parseFloat(amount) - 0.000005).toFixed(6) : "0.00"} SOL</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleWithdraw}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        disabled={!amount || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing
                          </>
                        ) : (
                          <>
                            Withdraw SOL <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
