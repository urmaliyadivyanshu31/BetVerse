"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateChatCompletion } from "@/lib/ai-client"
import { Sparkles, Zap, ArrowRight, Trophy, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface AIRecommendationsProps {
  userBettingHistory?: any[]
  preferredSports?: string[]
  className?: string
}

export default function AIRecommendations({
  userBettingHistory = [],
  preferredSports = ["cricket", "football", "basketball"],
  className = "",
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string>("")
  const [valueRecommendations, setValueRecommendations] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("matches")

  useEffect(() => {
    generateRecommendations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateRecommendations = async () => {
    setIsLoading(true)

    try {
      // Generate a prompt based on user preferences and history
      const prompt = `Based on the following information about a user, recommend 3-5 matches they might be interested in betting on in the next few days.
        Preferred sports: ${preferredSports.join(", ")}
        ${
          userBettingHistory.length > 0
            ? `Betting history: ${JSON.stringify(userBettingHistory)}`
            : "The user is new and has no betting history yet."
        }
        Format your response as a numbered list with the match name, date, and a brief reason why they might be interested.`

      const result = await generateChatCompletion([{ role: "user", content: prompt }])
      setRecommendations(result)

      // Generate value bet recommendations
      const valueBetPrompt = `Identify 2-3 potential value bets currently available on the platform.
        A value bet is where the odds offered suggest a lower probability than the actual probability of the outcome.
        Focus on ${preferredSports.join(", ")} matches in the next week.
        Format your response as a numbered list with the match name, the bet type, the odds, and a brief explanation of why this might be a value bet.`

      const valueBetsResult = await generateChatCompletion([{ role: "user", content: valueBetPrompt }])
      setValueRecommendations(valueBetsResult)
    } catch (error) {
      console.error("Error generating recommendations:", error)
      setRecommendations("Unable to generate recommendations at this time. Please try again later.")
      setValueRecommendations("Unable to generate value bet recommendations at this time. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="bg-primary/5 px-4 py-3 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">AI Recommendations</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateRecommendations}
          disabled={isLoading}
          className="h-8 px-2 text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start px-4 pt-3 bg-transparent">
          <TabsTrigger value="matches" className="data-[state=active]:bg-primary/10">
            <Zap className="h-4 w-4 mr-2" />
            Recommended Matches
          </TabsTrigger>
          <TabsTrigger value="value" className="data-[state=active]:bg-primary/10">
            <Trophy className="h-4 w-4 mr-2" />
            Value Bets
          </TabsTrigger>
        </TabsList>

        <CardContent className="p-4">
          <TabsContent value="matches" className="mt-0">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="whitespace-pre-wrap text-sm">{recommendations}</div>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href="/matches">
                    View All Matches <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="value" className="mt-0">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="whitespace-pre-wrap text-sm">{valueRecommendations}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Value bets are where the odds suggest a lower probability than the actual probability of the outcome.
                </div>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
