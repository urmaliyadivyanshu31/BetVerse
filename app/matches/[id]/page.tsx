"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Zap, Users, Info, BarChart3, History, MessageSquare, Sparkles } from "lucide-react"
import { useWallet } from "@/components/wallet-provider"
import AnimatedBackground from "@/components/animated-background"
import FadeInSection from "@/components/fade-in-section"
import Image from "next/image"
import MatchPrediction from "@/components/match-prediction"
import MatchInsightsWidget from "@/components/match-insights-widget"
import AIBettingAssistant from "@/components/ai-betting-assistant"

// Mock data for the match
const matchData2 = {
  id: "CR1001",
  team1: {
    name: "Indians",
    logo: "https://media-hosting.imagekit.io/74c4b80444da42e8/Board_of_Control_for_Cricket_in_India_Logo_(2024).svg?Expires=1841939589&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=uY5FGDDJG5EPp~foAYhNd-A21MuoY2K5AIC6s5Nchzacg6rHtDQhGt6nxHh6rTXyQwd5h8MHZJPiVX3WvsnRVF45w6mGk9uogeg918n-7CkvCgz9CgqU7PWKImB-WyLvU7Nx2xM8n-Ct2eqGKMHrBKZK9AfZgJEuzRm53xjnuztBoSFLB~lquabWPRrsXPPXUTni7t5fJIhRAoQMzKtrTGhrvAjMyxOvYfvbWmpS4wybE83RPF0~p3aNg4Rw4VowIJSYkfLc8FQK28QI4nMNBufuS4o6dpVGWkTtbg5Zsf9uxCEu3hPkjm7--hiAF1taqnG3FK440Phryk05wA5Vhw__",
    color: "blue",
    score: "142/3 (15.2)",
    odds: "3.89",
    recentForm: ["W", "W", "L", "W", "W"],
  },
  team2: {
    name: "Australia",
    logo: "https://media-hosting.imagekit.io/dbecdefbdee642d8/Cricket_Australia.png?Expires=1841939641&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=uPCW8E8sk8kL8F9Kqj1-0CUEQ94ua1MX9ga9ZYtEJK7SlE96eayzzzEWE5SlcYoEyCTR~nu-WAXdIlSxGRrZjcrd~x7vRR9UUNpgtho-dpFwIV3SrjP9xT2931ab7mdsC7AtYbf7zWL8HjzCsL8HAPwPHopFBdd47xAP6pl5KUfRACcjlFTfw~Qm-t-oaa2m-mVxtNjRLm-xNAUuuxsSbBsRMD5SuW42vNcQ5eZqvlz61ExlfJiamug~ulbkfKNCuAUxFCHdzYq--AnKYsUwCTBA7aNsbUIYBExY~xjbeOV19XY-hQt75RdkzDlu5sucYTOwkotWlgQu-AexYhzaKw__",
    color: "yellow",
    score: "Target: 186",
    odds: "2.25",
    recentForm: ["W", "L", "W", "L", "W"],
  },
  drawOdds: "0.12",
  isLive: true,
  timeLeft: "32:15",
  venue: "Wankhede Stadium, Mumbai",
  tournament: "IPL 2023",
  date: "May 10, 2023",
  time: "19:30 IST",
  liquidity: "$24,560",
  popularity: 78,
  headToHead: [
    { date: "Apr 21, 2023", winner: "Mumbai Indians", score: "MI: 157/8, CSK: 155/7" },
    { date: "Mar 15, 2023", winner: "Chennai Super Kings", score: "CSK: 178/5, MI: 176/6" },
    { date: "May 7, 2022", winner: "Mumbai Indians", score: "MI: 168/5, CSK: 156/7" },
  ],
  keyPlayers: [
    { name: "Rohit Sharma", team: "Mumbai Indians", role: "Batsman", image: "/players/rohit.png" },
    { name: "MS Dhoni", team: "Chennai Super Kings", role: "Wicket Keeper", image: "/players/dhoni.png" },
    { name: "Jasprit Bumrah", team: "Mumbai Indians", role: "Bowler", image: "/players/bumrah.png" },
    { name: "Ravindra Jadeja", team: "Chennai Super Kings", role: "All-rounder", image: "/players/jadeja.png" },
  ],
}
const matchData = {
  id: "CR1002",
  team1: {
    name: "Royal Challengers Bangalore",
    logo: "https://media-hosting.imagekit.io/c4a7bba832f34a56/screenshot_1747368167104.png?Expires=1841976170&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=pQq45~aYDwagu2TfBm1wwDBGSXuvjsZoe6o6~rZJYUsrEacaNWVVZvkh7YeDiIA3qugSWi4TBinen6KSSdOYMhtAsGCeTs7H8yMb7zn1y9BJfi1Xq-2swFsK-KsXoRKJbUQVB6VrBYAL~MONiP9kpItJRwgqE0BSkW2a2jCnCp8iIZZqEZZoqvSaEwS4nV9aNagGlAzcPlSwBhVDlDHGUke4K1Qd~HGV8P9GGMHFNmrkUh6~IO1WY4eonNPhLEcvLL7Azkg5GR0ZaALo1htV6lF82v7BM0pF3DVlIF2EhKp8ipAVW-ADUFvPUjJZo0lsBhfbdF1P~tK49KSCn29trQ__",
    color: "#d62828",
    score: "95/2 (10.3)",
    odds: "2.10",
    recentForm: ["W", "L", "W", "W", "L"],
  },
  team2: {
    name: "Kolkata Knight Riders",
    logo: "https://media-hosting.imagekit.io/a838787683514c69/screenshot_1747368176857.png?Expires=1841976179&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=EdkCjMM21IXOU2yfmdiBnIiI565nqDbo8QzngFQrxxpL2MEBIP0Bt0sUP1hypJdHFG80ANDIfadgMtIcJQbcv72lX0a2EO5yUS8FtmhLZvNqoBSrzQgTO8DJteA5h4Whkjs5kIdTTnt3LLJgW4p~TmJJ~wiyPU22jLCrump2AQ8kYT2SS0sNvJVyvW6bRxFX82Yyf9T4wMwZ~Rjm~92PArdiuoFVl2DOdr7LmMieR63wwg4Y2flD~H18z36KUOFaaX1H~2Vho6pgrWg4-fHdMYUlUJ5wYeG~W-9Sg-Ug2mcgbOEHI1KOLP-Jn3LSzdFPzlRQC0EaKwmOzOlf2sHdeg__",
    color: "#862df2",
    score: "Target: 175",
    odds: "1.75",
    recentForm: ["L", "W", "W", "L", "W"],
  },
  drawOdds: "0.11",
  isLive: true,
  timeLeft: "12:45",
  venue: "M. Chinnaswamy Stadium",
  tournament: "IPL 2024",
  date: "May 16, 2024",
  time: "20:00 IST",
  liquidity: "$18,320",
  popularity: 65,
  headToHead: [
    { date: "Apr 12, 2024", winner: "Kolkata Knight Riders", score: "KKR: 182/6, RCB: 167/8" },
    { date: "Mar 28, 2023", winner: "Royal Challengers Bangalore", score: "RCB: 190/5, KKR: 176/7" },
    { date: "May 3, 2022", winner: "Kolkata Knight Riders", score: "KKR: 169/4, RCB: 154/9" },
  ],
  keyPlayers: [
    { name: "Virat Kohli", team: "Royal Challengers Bangalore", role: "Batsman", image: "https://media-hosting.imagekit.io/9de0de4fc09c4961/screenshot_1747368556485.png?Expires=1841976559&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Kmlj~RiRqAGTpegF0Y780SLJeVH8oIp~M9pMJlzluRkXgz5jIkAvryvd2BkRfYQ~ZtKnnfOgHIOzc82zJh4VmZFymz1Im5JcSBYEs0~kug1GiNsvum5uvuAu5~TUloBNfd8rXFpPORj~f6FJAm7VB7v~RmXVYbx-eHN4kAQxhSDf4Nx57jlUTCZuD068lpWp7rikrtVJpfUR1d2rbzdIv5O94ESWfL2BqjI1obtbr7vFApqlEqJKvadVZUVI3INC1c2Vtw4Co0qGZeNBkCFoRfx6pPxWyiUajiUSazZxrjLnbMZ6wQVeGIy6jc6M0WWXa1Y4B4tzDVQDnADaono1vQ__" },
    { name: "Sunil Narine", team: "Kolkata Knight Riders", role: "All-rounder", image: "https://media-hosting.imagekit.io/20fe340e8ab742c9/screenshot_1747368571153.png?Expires=1841976574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=MHwmhyaOr4KWP57~fW2vL1OitJWAgxuxoGbftT2Wx2fZtYD0zlB-rwqMgCDur-hQ5UpWnwPneJIoSEI~nY4RrgBjL8dXiiBpBHEhbZuesToi72yz0G8LznXA8RJeQIPqO6uUWk73m9SpUfSa6NhDELRDbdV0kUcj9BOls7HxNpoZ9dV5-JlipWdTcG6iaCltt8aRcat6~D61yo1kgUTXX4BmKG13cSY8R~EJI-tslndlTqeSdCHMW0x4aY7hGaL12nVHNlbQWHQ8NvHGYXwnwDJ8aVFmdL~HrvhH-ul9T9WJoYHWMZJDlCr1Sagwzv6Lxfzk3U0hcduzghih-rccGg__" },
    { name: "Faf du Plessis", team: "Royal Challengers Bangalore", role: "Batsman", image: "https://media-hosting.imagekit.io/37b1a6203fe44e55/screenshot_1747368586583.png?Expires=1841976589&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=1mNy61gkf-ySW0v8mPmYpSvGc6KJF3NPl2Inzqz-GR1GhiHLWZqTa4qb8qdoAHz9dSx1hBZEXTvCCjdsADHW7Y1YUS4XeCDhWINVx-7PGxMF3vn~MnFI4U72kgrKf9ecdAmp3l5O5dvhnWTJWYthNuvqoPzFsTlxJznq507P9rBIf-WaH4IayGWetymP83-Eueg8MWm9QfHAWXQWzeK99Y48NqfT~fDspkBMyJ2tsT8pJSTiIVUwMlG1kd8PCRav7YPwXLWwBstYzE-FLrP2EWYmx8XZfLVKgB7kX2rO0Uz1bf3j27iT7Jjz0loHMAiHX5X6cRoSMx-wBDj847Z6Lg__" },
    { name: "Andre Russell", team: "Kolkata Knight Riders", role: "All-rounder", image: "https://media-hosting.imagekit.io/a636494163b74a20/screenshot_1747368602871.png?Expires=1841976606&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=VbNg0d-tGN2xLTPhV2vfySnnnZDYyRTQ6XghfvQGj~OYRRHqHGEwu3hOjCJK5FHHL~8IMFNUiei~zwsLLLFF1WdqZVH3tl~OTTb9v9JGncUOJ8vgMtxzr5XqaskPQpnSFg~8WFpnoy-BsRPonUIZQXb4kP48skhtNvTFv7xBe-zA7VBikAdyts80LXHJEgIRBQMMggYz1CTzBkWR5FRi0oXYqTC4DkYjttVvE6u4N4WjMaM-xAv~sscktruGYUtYqEKZrBExKeuV8yQ2b0IxG0NaFjNnnKJEgrZmF~7uZiaHYU75j88mS2GJy0cd~DFjncLSF6Fs27XoK6hve9uj0g__" },
  ],
};

export default function MatchDetailsPage({ params }: { params: { id: string } }) {
  const { isConnected, placeBet } = useWallet()
  const { toast } = useToast()
  const [betAmount, setBetAmount] = useState("50")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedOdds, setSelectedOdds] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)

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
      const odds = Number.parseFloat(selectedOdds)
      const team = selectedTeam

      const success = await placeBet(amount, params.id, team, odds)

      if (success) {
        setBetAmount("50")
        setSelectedTeam("")
        setSelectedOdds("")
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
    setSelectedTeam(team)
    setSelectedOdds(odds)
    setDialogOpen(true)
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      red: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      yellow: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      purple: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      green: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    }
    return colorMap[color] || "bg-primary/10 text-primary hover:bg-primary/20"
  }

  const getTextColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "text-blue-500",
      red: "text-red-500",
      yellow: "text-yellow-500",
      purple: "text-purple-500",
      green: "text-green-500",
    }
    return colorMap[color] || "text-primary"
  }

  const team1ColorClass = getColorClass(matchData.team1.color)
  const team2ColorClass = getColorClass(matchData.team2.color)
  const team1TextColorClass = getTextColorClass(matchData.team1.color)
  const team2TextColorClass = getTextColorClass(matchData.team2.color)

  // Create match context for AI assistant
  const matchContext = `This conversation is about the ${matchData.tournament} match between ${
    matchData.team1.name
  } and ${matchData.team2.name} on ${matchData.date}. Match ID: ${params.id}. ${
    matchData.isLive ? "This match is currently live." : "This match is upcoming."
  }`

  return (
    <AnimatedBackground variant="dots" className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <FadeInSection>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <div className="px-2 py-1 rounded-full bg-secondary text-xs font-medium">{matchData.tournament}</div>
              {matchData.isLive && (
                <div className="flex items-center space-x-2">
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-sm font-medium text-red-500">LIVE</span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">Match #{params.id}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 team-logo">
                  <div
                    className={`absolute inset-0 ${matchData.team1.color === "blue" ? "bg-blue-500/10" : matchData.team1.color === "red" ? "bg-red-500/10" : matchData.team1.color === "yellow" ? "bg-yellow-500/10" : matchData.team1.color === "purple" ? "bg-purple-500/10" : "bg-primary/10"} rounded-full`}
                  ></div>
                  <div className="relative h-full w-full rounded-full bg-card border border-border flex items-center justify-center">
                    <Image
                      src={matchData.team1.logo || "/placeholder.svg"}
                      alt={matchData.team1.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold font-heading mb-2">{matchData.team1.name}</h2>
                {matchData.isLive && <p className="text-lg text-muted-foreground">{matchData.team1.score}</p>}
                <div className="flex justify-center mt-3 space-x-1">
                  {matchData.team1.recentForm.map((result, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        result === "W" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-muted-foreground mb-4">VS</div>
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {matchData.isLive ? `Time Left: ${matchData.timeLeft}` : `${matchData.date} - ${matchData.time}`}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{matchData.venue}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 team-logo">
                  <div
                    className={`absolute inset-0 ${matchData.team2.color === "blue" ? "bg-blue-500/10" : matchData.team2.color === "red" ? "bg-red-500/10" : matchData.team2.color === "yellow" ? "bg-yellow-500/10" : matchData.team2.color === "purple" ? "bg-purple-500/10" : "bg-primary/10"} rounded-full`}
                  ></div>
                  <div className="relative h-full w-full rounded-full bg-card border border-border flex items-center justify-center">
                    <Image
                      src={matchData.team2.logo || "/placeholder.svg"}
                      alt={matchData.team2.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold font-heading mb-2">{matchData.team2.name}</h2>
                {matchData.isLive && <p className="text-lg text-muted-foreground">{matchData.team2.score}</p>}
                <div className="flex justify-center mt-3 space-x-1">
                  {matchData.team2.recentForm.map((result, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        result === "W" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <Card className="mb-8 bet-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold font-heading">Place Your Bet</h3>
                      <Button
                        onClick={() => setShowAIChat(!showAIChat)}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        {showAIChat ? "Hide AI Assistant" : "Ask AI Assistant"}
                        <Sparkles className="ml-2 h-4 w-4 text-primary" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <Button
                        variant="outline"
                        className={`flex flex-col items-center justify-center h-24 hover:${team1ColorClass}`}
                        onClick={() => openBetDialog(matchData.team1.name, matchData.team1.odds)}
                      >
                        <span className="text-sm text-muted-foreground">Back</span>
                        <span className={`text-2xl font-bold ${team1TextColorClass}`}>{matchData.team1.odds}</span>
                        <span className="text-xs text-muted-foreground">{matchData.team1.name.split(" ")[0]}</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 hover:bg-primary/5 hover:border-primary/50"
                        onClick={() => openBetDialog("Draw", matchData.drawOdds)}
                      >
                        <span className="text-sm text-muted-foreground">Draw</span>
                        <span className="text-2xl font-bold text-primary">{matchData.drawOdds}</span>
                        <span className="text-xs text-muted-foreground">X</span>
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex flex-col items-center justify-center h-24 hover:${team2ColorClass}`}
                        onClick={() => openBetDialog(matchData.team2.name, matchData.team2.odds)}
                      >
                        <span className="text-sm text-muted-foreground">Back</span>
                        <span className={`text-2xl font-bold ${team2TextColorClass}`}>{matchData.team2.odds}</span>
                        <span className="text-xs text-muted-foreground">{matchData.team2.name.split(" ")[0]}</span>
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 text-primary mr-2" />
                        <span className="text-muted-foreground">
                          Liquidity: <span className="font-medium text-foreground">{matchData.liquidity}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-primary mr-1" />
                          <span className="text-sm text-muted-foreground">
                            <span className="font-medium">{matchData.popularity}%</span> of users betting
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {showAIChat && (
                  <div className="mb-8 animate-fade-in">
                    <AIBettingAssistant
                      initialContext={matchContext}
                      sport="cricket"
                      compact={true}
                      className="shadow-md"
                    />
                  </div>
                )}

                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="mb-8 w-full justify-start">
                    <TabsTrigger value="stats" className="rounded-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Match Stats
                    </TabsTrigger>
                    <TabsTrigger value="h2h" className="rounded-full">
                      <History className="h-4 w-4 mr-2" />
                      Head to Head
                    </TabsTrigger>
                    <TabsTrigger value="players" className="rounded-full">
                      <Users className="h-4 w-4 mr-2" />
                      Key Players
                    </TabsTrigger>
                    <TabsTrigger value="info" className="rounded-full">
                      <Info className="h-4 w-4 mr-2" />
                      Match Info
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="rounded-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Analysis
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="stats" className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4 font-heading">Match Statistics</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Win Probability</span>
                              <span className="text-muted-foreground">
                                {matchData.team1.name.split(" ")[0]} vs {matchData.team2.name.split(" ")[0]}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full ${matchData.team1.color === "blue" ? "bg-blue-500" : matchData.team1.color === "red" ? "bg-red-500" : matchData.team1.color === "yellow" ? "bg-yellow-500" : matchData.team1.color === "purple" ? "bg-purple-500" : "bg-primary"}`}
                                style={{ width: "55%" }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>55%</span>
                              <span>45%</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">Batting Average</div>
                              <div className="text-lg font-medium">168.5</div>
                              <div className="text-xs text-muted-foreground">Last 5 matches</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">Wickets Taken</div>
                              <div className="text-lg font-medium">38</div>
                              <div className="text-xs text-muted-foreground">Last 5 matches</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">Run Rate</div>
                              <div className="text-lg font-medium">8.4</div>
                              <div className="text-xs text-muted-foreground">Last 5 matches</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="h2h" className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4 font-heading">Head to Head</h3>
                        <div className="space-y-4">
                          {matchData.headToHead.map((match, index) => (
                            <div key={index} className="p-4 border border-border rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">{match.date}</span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    match.winner === matchData.team1.name
                                      ? `bg-${matchData.team1.color}-500/20 text-${matchData.team1.color}-500`
                                      : `bg-${matchData.team2.color}-500/20 text-${matchData.team2.color}-500`
                                  }`}
                                >
                                  {match.winner} won
                                </span>
                              </div>
                              <div className="text-sm">{match.score}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="players" className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4 font-heading">Key Players</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {matchData.keyPlayers.map((player, index) => (
                            <div key={index} className="text-center">
                              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-secondary overflow-hidden">
                                <Image
                                  src={player.image || `/placeholder.svg?height=64&width=64&query=${player.name}`}
                                  alt={player.name}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                              <div className="font-medium text-sm">{player.name}</div>
                              <div className="text-xs text-muted-foreground">{player.role}</div>
                              <div
                                className={`text-xs mt-1 ${
                                  player.team === matchData.team1.name ? team1TextColorClass : team2TextColorClass
                                }`}
                              >
                                {player.team}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="info" className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4 font-heading">Match Information</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Tournament</div>
                              <div className="font-medium">{matchData.tournament}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Match ID</div>
                              <div className="font-medium">#{params.id}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                              <div className="font-medium">
                                {matchData.date} - {matchData.time}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Venue</div>
                              <div className="font-medium">{matchData.venue}</div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-border">
                            <div className="text-sm text-muted-foreground mb-2">Betting Information</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Liquidity Pool</div>
                                <div className="font-medium">{matchData.liquidity}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Platform Fee</div>
                                <div className="font-medium">0.1%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-6">
                    <MatchPrediction
                      team1={matchData.team1.name}
                      team2={matchData.team2.name}
                      team1Odds={matchData.team1.odds}
                      team2Odds={matchData.team2.odds}
                      drawOdds={matchData.drawOdds}
                      sport="cricket"
                      matchDate={matchData.date}
                      venue={matchData.venue}
                      tournament={matchData.tournament}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <MatchInsightsWidget
                  team1={matchData.team1.name}
                  team2={matchData.team2.name}
                  sport="cricket"
                  tournament={matchData.tournament}
                />

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-3 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                      Ask AI Assistant
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our AI can analyze this match and provide insights on team performance, player stats, and betting
                      strategies.
                    </p>
                    <div className="space-y-2">
                      <div className="p-2 bg-primary/5 rounded-md text-sm hover:bg-primary/10 cursor-pointer transition-colors">
                        "What's the head-to-head record for these teams?"
                      </div>
                      <div className="p-2 bg-primary/5 rounded-md text-sm hover:bg-primary/10 cursor-pointer transition-colors">
                        "Who are the key players to watch in this match?"
                      </div>
                      <div className="p-2 bg-primary/5 rounded-md text-sm hover:bg-primary/10 cursor-pointer transition-colors">
                        "Is the current betting odds offering good value?"
                      </div>
                    </div>
                    <Button onClick={() => setShowAIChat(!showAIChat)} className="w-full mt-4 bg-primary text-white">
                      {showAIChat ? "Hide AI Assistant" : "Open AI Assistant"}
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>

      <Footer />
    </AnimatedBackground>
  )
}
