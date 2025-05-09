"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, Zap } from "lucide-react"
import { useWallet } from "./wallet-provider"

export default function UpcomingMatches() {
  const [activeTab, setActiveTab] = useState("cricket")

  return (
    <div>
      <Tabs defaultValue="cricket" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 w-full justify-start">
          <TabsTrigger value="cricket" className="rounded-full">
            Cricket (IPL)
          </TabsTrigger>
          <TabsTrigger value="football" className="rounded-full">
            Football
          </TabsTrigger>
          <TabsTrigger value="basketball" className="rounded-full">
            Basketball
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cricket" className="space-y-6">
          <UpcomingMatchCard
            id="CR2001"
            team1="Delhi Capitals"
            team2="Rajasthan Royals"
            team1Odds="2.05"
            team2Odds="1.80"
            drawOdds="3.60"
            date="May 12, 2023"
            time="19:30 IST"
            liquidity="$15,780"
          />
          <UpcomingMatchCard
            id="CR2002"
            team1="Punjab Kings"
            team2="Sunrisers Hyderabad"
            team1Odds="1.95"
            team2Odds="1.90"
            drawOdds="3.40"
            date="May 14, 2023"
            time="15:30 IST"
            liquidity="$12,450"
          />
        </TabsContent>

        <TabsContent value="football" className="space-y-6">
          <UpcomingMatchCard
            id="FB2001"
            team1="Arsenal"
            team2="Chelsea"
            team1Odds="1.75"
            team2Odds="2.15"
            drawOdds="3.30"
            date="May 13, 2023"
            time="17:00 GMT"
            liquidity="$22,340"
          />
        </TabsContent>

        <TabsContent value="basketball" className="space-y-6">
          <UpcomingMatchCard
            id="BB2001"
            team1="Boston Celtics"
            team2="Miami Heat"
            team1Odds="1.65"
            team2Odds="2.25"
            drawOdds="12.00"
            date="May 15, 2023"
            time="19:00 EST"
            liquidity="$18,670"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface UpcomingMatchCardProps {
  id: string
  team1: string
  team2: string
  team1Odds: string
  team2Odds: string
  drawOdds: string
  date: string
  time: string
  liquidity: string
}

function UpcomingMatchCard({
  id,
  team1,
  team2,
  team1Odds,
  team2Odds,
  drawOdds,
  date,
  time,
  liquidity,
}: UpcomingMatchCardProps) {
  const { toast } = useToast()
  const { isConnected, placeBet } = useWallet()
  const [betAmount, setBetAmount] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPlacingBet, setIsPlacingBet] = useState(false)

  const handlePlaceBet = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to place a bet.",
        variant: "destructive",
      })
      return
    }

    setIsPlacingBet(true)

    try {
      const amount = Number.parseFloat(betAmount)
      const odds = Number.parseFloat(selectedTeam.split("(")[1].split(")")[0])
      const team = selectedTeam.split(" (")[0]

      const success = await placeBet(amount, id, team, odds)

      if (success) {
        setBetAmount("")
        setSelectedTeam("")
        setDialogOpen(false)
      }
    } catch (error) {
      console.error("Error placing bet:", error)
      toast({
        title: "Bet Failed",
        description: "There was an error placing your bet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingBet(false)
    }
  }

  const openBetDialog = (team: string, odds: string) => {
    setSelectedTeam(`${team} (${odds})`)
    setDialogOpen(true)
  }

  return (
    <Card className="overflow-hidden border-border hover:shadow-md transition-all duration-300">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-sm text-muted-foreground">Match #{id}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                <span>{date}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1 text-primary" />
                <span>{time}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-accent mx-auto mb-2 flex items-center justify-center">
                <span className="text-lg font-bold">
                  {team1.split(" ")[0][0]}
                  {team1.split(" ")[1]?.[0]}
                </span>
              </div>
              <div className="text-base font-medium">{team1}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-muted-foreground">VS</div>
            </div>
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-accent mx-auto mb-2 flex items-center justify-center">
                <span className="text-lg font-bold">
                  {team2.split(" ")[0][0]}
                  {team2.split(" ")[1]?.[0]}
                </span>
              </div>
              <div className="text-base font-medium">{team2}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Dialog
              open={dialogOpen && selectedTeam.includes(team1)}
              onOpenChange={(open) => !open && setDialogOpen(false)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 hover:border-green-500/50 hover:bg-green-500/5"
                  onClick={() => openBetDialog(team1, team1Odds)}
                >
                  <span className="text-sm text-muted-foreground">Back</span>
                  <span className="text-2xl font-bold text-green-500">{team1Odds}</span>
                  <span className="text-xs text-muted-foreground">{team1.split(" ")[0]}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Place a Bet</DialogTitle>
                  <DialogDescription>
                    You are about to place a bet on {team1} with odds of {team1Odds}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="amount" className="text-right text-muted-foreground">
                      Amount (USDC)
                    </label>
                    <div className="col-span-3 relative">
                      <Input
                        id="amount"
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="pl-8"
                        placeholder="Enter bet amount"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="potential-win" className="text-right text-muted-foreground">
                      Potential Win
                    </label>
                    <div className="col-span-3 text-green-500 font-medium">
                      ${betAmount ? (Number.parseFloat(betAmount) * Number.parseFloat(team1Odds)).toFixed(2) : "0.00"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handlePlaceBet} className="bg-primary hover:bg-primary/90" disabled={isPlacingBet}>
                    {isPlacingBet ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "Place Bet"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={dialogOpen && selectedTeam.includes("Draw")}
              onOpenChange={(open) => !open && setDialogOpen(false)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => openBetDialog("Draw", drawOdds)}
                >
                  <span className="text-sm text-muted-foreground">Draw</span>
                  <span className="text-2xl font-bold text-primary">{drawOdds}</span>
                  <span className="text-xs text-muted-foreground">X</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Place a Bet</DialogTitle>
                  <DialogDescription>You are about to place a bet on Draw with odds of {drawOdds}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="amount" className="text-right text-muted-foreground">
                      Amount (USDC)
                    </label>
                    <div className="col-span-3 relative">
                      <Input
                        id="amount"
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="pl-8"
                        placeholder="Enter bet amount"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="potential-win" className="text-right text-muted-foreground">
                      Potential Win
                    </label>
                    <div className="col-span-3 text-green-500 font-medium">
                      ${betAmount ? (Number.parseFloat(betAmount) * Number.parseFloat(drawOdds)).toFixed(2) : "0.00"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handlePlaceBet} className="bg-primary hover:bg-primary/90" disabled={isPlacingBet}>
                    {isPlacingBet ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "Place Bet"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={dialogOpen && selectedTeam.includes(team2)}
              onOpenChange={(open) => !open && setDialogOpen(false)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 hover:border-red-500/50 hover:bg-red-500/5"
                  onClick={() => openBetDialog(team2, team2Odds)}
                >
                  <span className="text-sm text-muted-foreground">Back</span>
                  <span className="text-2xl font-bold text-red-500">{team2Odds}</span>
                  <span className="text-xs text-muted-foreground">{team2.split(" ")[0]}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Place a Bet</DialogTitle>
                  <DialogDescription>
                    You are about to place a bet on {team2} with odds of {team2Odds}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="amount" className="text-right text-muted-foreground">
                      Amount (USDC)
                    </label>
                    <div className="col-span-3 relative">
                      <Input
                        id="amount"
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="pl-8"
                        placeholder="Enter bet amount"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="potential-win" className="text-right text-muted-foreground">
                      Potential Win
                    </label>
                    <div className="col-span-3 text-green-500 font-medium">
                      ${betAmount ? (Number.parseFloat(betAmount) * Number.parseFloat(team2Odds)).toFixed(2) : "0.00"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handlePlaceBet} className="bg-primary hover:bg-primary/90" disabled={isPlacingBet}>
                    {isPlacingBet ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "Place Bet"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-primary mr-1" />
              <span className="text-muted-foreground">
                Liquidity: <span className="font-medium text-foreground">{liquidity}</span>
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              See All Markets
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
