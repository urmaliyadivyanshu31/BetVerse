"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ArrowUpRight, Clock, Zap } from "lucide-react"
import { useWallet } from "./wallet-provider"
import { cn } from "@/lib/utils"

export default function LiveBets() {
  const { toast } = useToast()
  const { isConnected, placeBet } = useWallet()
  const [activeTab, setActiveTab] = useState("cricket")
  const [isPlacingBet, setIsPlacingBet] = useState<string | null>(null)

  const handleBet = async (matchId: string, type: string, odds: string, team: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to place a bet.",
        variant: "destructive",
      })
      return
    }

    setIsPlacingBet(`${matchId}-${type}`)

    try {
      // For live bets, we'll use a fixed amount of $50
      const amount = 50
      const success = await placeBet(amount, matchId, `${type} on ${team}`, Number.parseFloat(odds))

      if (success) {
        // Success is handled by the placeBet function
      }
    } catch (error) {
      console.error("Error placing bet:", error)
      toast({
        title: "Bet Failed",
        description: "There was an error placing your bet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingBet(null)
    }
  }

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
          <LiveBetCard
            id="CR1001"
            team1="Mumbai Indians"
            team2="Chennai Super Kings"
            team1Odds="1.95"
            team2Odds="1.85"
            drawOdds="3.50"
            timeLeft="32:15"
            liquidity="$24,560"
            onBet={handleBet}
            isPlacingBet={isPlacingBet}
          />
          <LiveBetCard
            id="CR1002"
            team1="Royal Challengers Bangalore"
            team2="Kolkata Knight Riders"
            team1Odds="2.10"
            team2Odds="1.75"
            drawOdds="3.80"
            timeLeft="12:45"
            liquidity="$18,320"
            onBet={handleBet}
            isPlacingBet={isPlacingBet}
          />
        </TabsContent>

        <TabsContent value="football" className="space-y-6">
          <LiveBetCard
            id="FB1001"
            team1="Manchester United"
            team2="Liverpool"
            team1Odds="2.25"
            team2Odds="1.65"
            drawOdds="3.20"
            timeLeft="45:00"
            liquidity="$32,450"
            onBet={handleBet}
            isPlacingBet={isPlacingBet}
          />
          <LiveBetCard
            id="FB1002"
            team1="Barcelona"
            team2="Real Madrid"
            team1Odds="1.90"
            team2Odds="1.90"
            drawOdds="3.50"
            timeLeft="22:30"
            liquidity="$42,780"
            onBet={handleBet}
            isPlacingBet={isPlacingBet}
          />
        </TabsContent>

        <TabsContent value="basketball" className="space-y-6">
          <LiveBetCard
            id="BB1001"
            team1="LA Lakers"
            team2="Golden State Warriors"
            team1Odds="1.85"
            team2Odds="1.95"
            drawOdds="15.00"
            timeLeft="08:22"
            liquidity="$28,950"
            onBet={handleBet}
            isPlacingBet={isPlacingBet}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface LiveBetCardProps {
  id: string
  team1: string
  team2: string
  team1Odds: string
  team2Odds: string
  drawOdds: string
  timeLeft: string
  liquidity: string
  onBet: (id: string, type: string, odds: string, team: string) => void
  isPlacingBet: string | null
}

function LiveBetCard({
  id,
  team1,
  team2,
  team1Odds,
  team2Odds,
  drawOdds,
  timeLeft,
  liquidity,
  onBet,
  isPlacingBet,
}: LiveBetCardProps) {
  return (
    <Card className="overflow-hidden border-border hover:shadow-md transition-all duration-300">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-sm font-medium text-red-500">LIVE</span>
              </div>
              <span className="text-sm text-muted-foreground">Match #{id}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{timeLeft}</span>
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
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 hover:border-green-500/50 hover:bg-green-500/5",
                isPlacingBet === `${id}-back` && "border-green-500/50 bg-green-500/5",
              )}
              onClick={() => onBet(id, "back", team1Odds, team1)}
              disabled={isPlacingBet === `${id}-back`}
            >
              <span className="text-sm text-muted-foreground">Back</span>
              <span className="text-2xl font-bold text-green-500">{team1Odds}</span>
              <span className="text-xs text-muted-foreground">{team1.split(" ")[0]}</span>
              {isPlacingBet === `${id}-back` && (
                <div className="mt-1 flex items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-green-500 border-t-transparent animate-spin mr-1"></div>
                  <span className="text-xs text-muted-foreground">Processing...</span>
                </div>
              )}
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 hover:border-primary/50 hover:bg-primary/5",
                isPlacingBet === `${id}-draw` && "border-primary/50 bg-primary/5",
              )}
              onClick={() => onBet(id, "draw", drawOdds, "Draw")}
              disabled={isPlacingBet === `${id}-draw`}
            >
              <span className="text-sm text-muted-foreground">Draw</span>
              <span className="text-2xl font-bold text-primary">{drawOdds}</span>
              <span className="text-xs text-muted-foreground">X</span>
              {isPlacingBet === `${id}-draw` && (
                <div className="mt-1 flex items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin mr-1"></div>
                  <span className="text-xs text-muted-foreground">Processing...</span>
                </div>
              )}
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 hover:border-red-500/50 hover:bg-red-500/5",
                isPlacingBet === `${id}-lay` && "border-red-500/50 bg-red-500/5",
              )}
              onClick={() => onBet(id, "lay", team2Odds, team2)}
              disabled={isPlacingBet === `${id}-lay`}
            >
              <span className="text-sm text-muted-foreground">Back</span>
              <span className="text-2xl font-bold text-red-500">{team2Odds}</span>
              <span className="text-xs text-muted-foreground">{team2.split(" ")[0]}</span>
              {isPlacingBet === `${id}-lay` && (
                <div className="mt-1 flex items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-red-500 border-t-transparent animate-spin mr-1"></div>
                  <span className="text-xs text-muted-foreground">Processing...</span>
                </div>
              )}
            </Button>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-primary mr-1" />
              <span className="text-muted-foreground">
                Liquidity: <span className="font-medium text-foreground">{liquidity}</span>
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              See All Markets <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
