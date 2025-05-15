'use client';

import AIBettingAssistant from "@/components/ai-betting-assistant"
import { AIInsightsSection } from "@/components/ai-insights-section"
import AIRecommendations from "@/components/ai-recommendations"

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
          AI Betting Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Get personalized betting insights and recommendations powered by advanced AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - AI Assistant */}
        <div className="lg:col-span-7 space-y-6">
          <AIBettingAssistant className="h-[600px]" initialContext="" sport="all" />
          <AIInsightsSection />
        </div>

        {/* Right Column - Recommendations */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            <AIRecommendations />
          </div>
        </div>
      </div>
    </div>
  )
}