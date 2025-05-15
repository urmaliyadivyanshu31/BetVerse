"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { generateChatCompletion } from "@/lib/ai-client"
import { Sparkles, TrendingUp, ArrowRight, Lightbulb, AlertCircle, RefreshCw, Clock, Tag, BarChart2, GemIcon, Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Insight {
  type: "trend" | "prediction" | "alert" | "info"
  title: string
  description: string
  time: string
  category: string
  confidence: number
}

const insights: Insight[] = [
  {
    type: "trend",
    title: "Rising Momentum in Home Team Performance",
    description: "Recent statistics show a significant improvement in home team's offensive stats.",
    time: "2 hours ago",
    category: "Team Analysis",
    confidence: 85
  },
  {
    type: "prediction",
    title: "High-Value Betting Opportunity",
    description: "Current odds suggest an undervalued position for the away team's spread.",
    time: "30 mins ago",
    category: "Odds Analysis",
    confidence: 75
  },
  {
    type: "alert",
    title: "Key Player Status Update",
    description: "Starting quarterback listed as questionable for upcoming game.",
    time: "5 mins ago",
    category: "Player Updates",
    confidence: 95
  }
]

export function AIInsightsSection() {
  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/15 to-primary/5 border-b border-border py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <CardDescription className="text-xs">Real-time betting analysis</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {insights.map((insight: Insight, index: number) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-gradient-to-br from-black to-white-50 border border-gray-200 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${getInsightIconStyle(insight.type)}`}
                >
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{insight.time}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Tag className="h-3.5 w-3.5 mr-1" />
                      <span>{insight.category}</span>
                    </div>
                    <div className={`flex items-center text-xs ${getConfidenceColor(insight.confidence)}`}>
                      <BarChart2 className="h-3.5 w-3.5 mr-1" />
                      <span>{insight.confidence}% confidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getInsightIconStyle(type: "trend" | "prediction" | "alert" | "info") {
  switch (type) {
    case "trend":
      return "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600";
    case "prediction":
      return "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600";
    case "alert":
      return "bg-gradient-to-br from-red-100 to-red-50 text-red-600";
    default:
      return "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600";
  }
}

function getInsightIcon(type: "trend" | "prediction" | "alert" | "info") {
  switch (type) {
    case "trend":
      return <TrendingUp className="h-4 w-4" />;
    case "prediction":
      return <GemIcon className="h-4 w-4" />;
    case "alert":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 80) return "text-green-600";
  if (confidence >= 60) return "text-yellow-600";
  return "text-red-600";
}
