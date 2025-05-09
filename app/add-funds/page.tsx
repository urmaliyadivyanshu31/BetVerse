"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import { useWallet } from "@/components/wallet-provider"
import { ArrowRight, Copy, DollarSign, RefreshCw } from "lucide-react"

export default function AddFundsPage() {
  const { isConnected, publicKey } = useWallet()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("usdc")

  const handleAddFunds = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to add funds.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Funds Added",
        description: `You've successfully added ${amount} ${activeTab.toUpperCase()} to your account.`,
      })

      setAmount("")
    } catch (error) {
      console.error("Error adding funds:", error)
      toast({
        title: "Transaction Failed",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Add Funds</h1>
          <p className="text-gray-500 mb-8">Add cryptocurrency to your betting account</p>

          {!isConnected ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 mb-4">Please connect your wallet to add funds</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Deposit Address</CardTitle>
                  <CardDescription>Send funds to this address to add them to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 p-3 rounded-md flex-1 text-sm overflow-hidden text-ellipsis">
                      {publicKey}
                    </div>
                    <Button variant="outline" size="icon" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Note: Only send SOL or SPL tokens (like USDC) to this address. Sending other tokens may result in
                    loss of funds.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Add</CardTitle>
                  <CardDescription>Add funds directly from your connected wallet</CardDescription>
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
                          <label className="text-sm font-medium text-gray-700 block mb-1">Amount (USDC)</label>
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
                            <Button variant="outline" onClick={() => setAmount("100")}>
                              $100
                            </Button>
                            <Button variant="outline" onClick={() => setAmount("500")}>
                              $500
                            </Button>
                          </div>
                        </div>
                        <Button
                          onClick={handleAddFunds}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                          disabled={!amount || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing
                            </>
                          ) : (
                            <>
                              Add USDC <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="sol">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">Amount (SOL)</label>
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                            />
                            <Button variant="outline" onClick={() => setAmount("1")}>
                              1 SOL
                            </Button>
                            <Button variant="outline" onClick={() => setAmount("5")}>
                              5 SOL
                            </Button>
                          </div>
                        </div>
                        <Button
                          onClick={handleAddFunds}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                          disabled={!amount || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing
                            </>
                          ) : (
                            <>
                              Add SOL <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
