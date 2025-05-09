"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { generateChatCompletion } from "@/lib/ai-client"
import { Sparkles, TrendingUp, ArrowRight, Lightbulb, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AIInsightsSection() {
  const [insights, setInsights] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateInsights()
  }, [])

  const generateInsights = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const prompt = `Share 3 key betting insights or trends for today's matches. 
      These should be specific, actionable insights that would be valuable for bettors.
      Each insight should be concise (1-2 sentences) and focused on a specific match, team, or trend.
      Format as a numbered list with emoji icons.`

      const result = await generateChatCompletion([{ role: "user", content: prompt }])

      if (result.includes("error") || result.includes("Error")) {
        throw new Error("Failed to generate insights")
      }

      setInsights(result)
    } catch (error) {
      console.error("Error generating insights:", error)
      setError("Unable to generate insights at this time. Please try again later.")
      setInsights("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-primary/5 px-4 py-3 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Today's AI Insights</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={generateInsights} disabled={isLoading} className="h-8 px-2 text-xs">
          <TrendingUp className={`h-3 w-3 mr-1 ${isLoading ? "animate-pulse" : ""}`} />
          Refresh
        </Button>
      </div>

      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap text-sm">{insights}</div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <Lightbulb className="h-3 w-3 mr-1" />
                <span>AI-powered insights based on latest data</span>
              </div>
              <Button variant="ghost" size="sm" className="text-primary text-xs" asChild>
                <Link href="/ai-assistant">
                  More Insights <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
