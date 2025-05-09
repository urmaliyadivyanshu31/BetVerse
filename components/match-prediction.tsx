"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateMatchPrediction, generateBettingStrategy } from "@/lib/ai-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, AlertCircle, Sparkles, Lightbulb, BookOpen } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MatchPredictionProps {
  team1: string
  team2: string
  team1Odds: string
  team2Odds: string
  drawOdds?: string
  sport: "cricket" | "football" | "basketball"
  matchDate?: string
  venue?: string
  tournament?: string
  className?: string
}

export default function MatchPrediction({
  team1,
  team2,
  team1Odds,
  team2Odds,
  drawOdds,
  sport,
  matchDate,
  venue,
  tournament,
  className = "",
}: MatchPredictionProps) {
  const [prediction, setPrediction] = useState<string>("")
  const [strategy, setStrategy] = useState<string>("")
  const [activeTab, setActiveTab] = useState("prediction")
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false)
  const [isLoadingStrategy, setIsLoadingStrategy] = useState(false)
  const [isPredictionGenerated, setIsPredictionGenerated] = useState(false)
  const [isStrategyGenerated, setIsStrategyGenerated] = useState(false)

  // Generate prediction automatically on first load
  useEffect(() => {
    handleGeneratePrediction()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGeneratePrediction = async () => {
    if (isLoadingPrediction) return
    setIsLoadingPrediction(true)

    try {
      // Create additional context with match details
      const matchDetails = `Date: ${matchDate || "Upcoming"}. Venue: ${venue || "Unknown"}. Tournament: ${
        tournament || sport
      }.`

      const result = await generateMatchPrediction(team1, team2, sport, matchDetails)
      setPrediction(result)
      setIsPredictionGenerated(true)
    } catch (error) {
      console.error("Error generating prediction:", error)
      setPrediction("Sorry, I couldn't generate a prediction at this time. Please try again later.")
    } finally {
      setIsLoadingPrediction(false)
    }
  }

  const handleGenerateStrategy = async () => {
    if (isLoadingStrategy) return
    setIsLoadingStrategy(true)

    try {
      const result = await generateBettingStrategy(team1, team2, team1Odds, team2Odds, drawOdds, sport)
      setStrategy(result)
      setIsStrategyGenerated(true)
    } catch (error) {
      console.error("Error generating strategy:", error)
      setStrategy("Sorry, I couldn't generate a betting strategy at this time. Please try again later.")
    } finally {
      setIsLoadingStrategy(false)
    }
  }

  return (
    <Card className={`border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="bg-primary/5 px-4 py-3 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">AI Insights</h3>
        </div>
        <div className="text-xs text-muted-foreground">Powered by Grok</div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start px-4 pt-3 bg-transparent">
          <TabsTrigger value="prediction" className="data-[state=active]:bg-primary/10">
            <BarChart3 className="h-4 w-4 mr-2" />
            Match Prediction
          </TabsTrigger>
          <TabsTrigger value="strategy" className="data-[state=active]:bg-primary/10">
            <TrendingUp className="h-4 w-4 mr-2" />
            Betting Strategy
          </TabsTrigger>
        </TabsList>

        <CardContent className="p-4">
          <TabsContent value="prediction" className="mt-0">
            {isLoadingPrediction ? (
              <div className="space-y-3">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ) : isPredictionGenerated ? (
              <div className="space-y-4">
                <div className="whitespace-pre-wrap text-sm">{prediction}</div>
                <div className="flex items-center pt-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>Predictions are based on historical data and current form. Bet responsibly.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Lightbulb className="h-12 w-12 text-primary/20 mb-3" />
                <h4 className="text-lg font-medium mb-2">Match Prediction</h4>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Get AI-powered insights about the likely outcome of this match based on team form, head-to-head
                  records, and other key factors.
                </p>
                <Button onClick={handleGeneratePrediction}>Generate Prediction</Button>
              </div>
            )}

            {isPredictionGenerated && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePrediction}
                disabled={isLoadingPrediction}
                className="mt-4"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Refresh Prediction
              </Button>
            )}
          </TabsContent>

          <TabsContent value="strategy" className="mt-0">
            {isLoadingStrategy ? (
              <div className="space-y-3">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ) : isStrategyGenerated ? (
              <div className="space-y-4">
                <div className="whitespace-pre-wrap text-sm">{strategy}</div>
                <div className="flex items-center pt-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>Strategies are for informational purposes only. Always do your own research.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <BookOpen className="h-12 w-12 text-primary/20 mb-3" />
                <h4 className="text-lg font-medium mb-2">Betting Strategy</h4>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Get AI-generated betting strategies based on the current odds, potential value bets, and risk
                  analysis.
                </p>
                <Button onClick={handleGenerateStrategy}>Generate Strategy</Button>
              </div>
            )}

            {isStrategyGenerated && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateStrategy}
                disabled={isLoadingStrategy}
                className="mt-4"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Refresh Strategy
              </Button>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
