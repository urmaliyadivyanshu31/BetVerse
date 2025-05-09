"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AIBettingAssistant from "@/components/ai-betting-assistant"
import AIRecommendations from "@/components/ai-recommendations"
import MatchPrediction from "@/components/match-prediction"
import AnimatedBackground from "@/components/animated-background"
import FadeInSection from "@/components/fade-in-section"
import { MessagesSquare, Sparkles, TrendingUp, BarChart2, Zap } from "lucide-react"

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState("chat")

  // Mock upcoming matches for demonstration
  const upcomingMatches = [
    {
      id: "CR2001",
      team1: "Mumbai Indians",
      team2: "Chennai Super Kings",
      team1Odds: "1.95",
      team2Odds: "1.85",
      drawOdds: "3.50",
      sport: "cricket" as const,
      matchDate: "2023-05-12",
      venue: "Wankhede Stadium",
      tournament: "IPL 2023",
    },
    {
      id: "FB2001",
      team1: "Manchester United",
      team2: "Liverpool",
      team1Odds: "2.25",
      team2Odds: "1.65",
      drawOdds: "3.20",
      sport: "football" as const,
      matchDate: "2023-05-14",
      venue: "Old Trafford",
      tournament: "Premier League",
    },
  ]

  return (
    <AnimatedBackground variant="dots" className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="flex items-center mb-6">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              <h1 className="text-3xl font-bold font-heading">AI Betting Assistant</h1>
            </div>
            <p className="text-gray-500 mb-8">
              Get intelligent predictions, analysis, and personalized recommendations powered by advanced AI
            </p>
          </FadeInSection>

          <FadeInSection delay={200}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto">
                <TabsTrigger
                  value="chat"
                  className="data-[state=active]:bg-primary/5 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2 px-4"
                >
                  <MessagesSquare className="h-4 w-4 mr-2" />
                  Chat Assistant
                </TabsTrigger>
                <TabsTrigger
                  value="predictions"
                  className="data-[state=active]:bg-primary/5 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2 px-4"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Match Predictions
                </TabsTrigger>
                <TabsTrigger
                  value="recommendations"
                  className="data-[state=active]:bg-primary/5 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2 px-4"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <AIBettingAssistant className="shadow-md" />
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-3 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                          How AI Can Help You
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start">
                            <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                              1
                            </span>
                            <span>Ask for match predictions and analysis on upcoming fixtures</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                              2
                            </span>
                            <span>Get insights on team form, player performance, and historical records</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                              3
                            </span>
                            <span>Discover value bets and optimal betting strategies based on odds</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                              4
                            </span>
                            <span>Learn about betting concepts, terminology, and responsible betting practices</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-3">Suggested Questions</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
                            "What factors should I consider when betting on IPL matches?"
                          </li>
                          <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
                            "Analyze the upcoming match between Mumbai Indians and Chennai Super Kings"
                          </li>
                          <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
                            "Explain how odds work and how to calculate potential winnings"
                          </li>
                          <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
                            "What's the difference between back and lay betting?"
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {upcomingMatches.map((match) => (
                    <MatchPrediction
                      key={match.id}
                      team1={match.team1}
                      team2={match.team2}
                      team1Odds={match.team1Odds}
                      team2Odds={match.team2Odds}
                      drawOdds={match.drawOdds}
                      sport={match.sport}
                      matchDate={match.matchDate}
                      venue={match.venue}
                      tournament={match.tournament}
                      className="shadow-md"
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <AIRecommendations className="shadow-md" />
                  </div>
                  <div>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-3">About AI Recommendations</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Our AI analyzes thousands of data points, including team performance, player statistics, and
                          historical matches to provide personalized recommendations tailored to your preferences.
                        </p>
                        <div className="space-y-4">
                          <div className="border-t border-border pt-3">
                            <h4 className="font-medium text-sm mb-2">Recommended Matches</h4>
                            <p className="text-xs text-muted-foreground">
                              Based on your betting history and preferences, we highlight matches you might be
                              interested in.
                            </p>
                          </div>
                          <div className="border-t border-border pt-3">
                            <h4 className="font-medium text-sm mb-2">Value Bets</h4>
                            <p className="text-xs text-muted-foreground">
                              Our AI identifies potential value bets where the odds offered may be more favorable than
                              the actual probability.
                            </p>
                          </div>
                          <div className="border-t border-border pt-3">
                            <h4 className="font-medium text-sm mb-2">Accuracy Rating</h4>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {Array(4)
                                  .fill(0)
                                  .map((_, i) => (
                                    <div
                                      key={i}
                                      className="w-2 h-6 bg-primary mr-0.5 rounded-sm"
                                      style={{ opacity: 1 - i * 0.2 }}
                                    ></div>
                                  ))}
                              </div>
                              <span className="text-xs text-muted-foreground ml-2">
                                Our AI recommendations have an average 78% accuracy rating
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </FadeInSection>
        </div>
      </div>
      <Footer />
    </AnimatedBackground>
  )
}
