"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateChatCompletion } from "@/lib/ai-client"
import { Lightbulb, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MatchInsightsWidgetProps {
  team1: string
  team2: string
  sport: "cricket" | "football" | "basketball"
  tournament?: string
  className?: string
  compact?: boolean
}

export default function MatchInsightsWidget({
  team1,
  team2,
  sport,
  tournament,
  className = "",
  compact = false,
}: MatchInsightsWidgetProps) {
  const [insights, setInsights] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    generateInsights()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team1, team2, sport])

  const generateInsights = async () => {
    setIsLoading(true)

    try {
      // Generate a prompt for key insights
      const prompt = `Provide ${compact ? "3" : "5"} key insights about the upcoming ${sport} match between ${team1} and ${team2}${
        tournament ? ` in the ${tournament}` : ""
      }.
      These should be factual, concise points that bettors would find useful when considering their bets.
      Focus on recent form, head-to-head history, key player availability, and any other factors that could influence the outcome.
      ${
        compact
          ? "Keep each insight very brief, maximum 1-2 sentences."
          : "Format as a numbered list with 1-2 sentences per insight."
      }`

      const result = await generateChatCompletion([{ role: "user", content: prompt }], sport)
      setInsights(result)
    } catch (error) {
      console.error("Error generating insights:", error)
      setInsights("Unable to generate insights at this time. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <Lightbulb className="h-4 w-4 text-primary mr-2" />
            <h3 className={`font-medium ${compact ? "text-sm" : ""}`}>Key Match Insights</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateInsights}
            disabled={isLoading}
            className="h-7 px-2 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-full h-3" />
            {!compact && (
              <>
                <Skeleton className="w-full h-3" />
                <Skeleton className="w-3/4 h-3" />
              </>
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm">{insights}</div>
        )}
      </CardContent>
    </Card>
  )
}
