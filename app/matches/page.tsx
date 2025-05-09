import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Filter, Calendar } from "lucide-react"
import BettingCard from "@/components/betting-card"
import AnimatedBackground from "@/components/animated-background"
import FadeInSection from "@/components/fade-in-section"

export default function MatchesPage() {
  return (
    <AnimatedBackground variant="dots" className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <FadeInSection>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 font-heading">Matches</h1>
            <p className="text-muted-foreground mb-8">Browse and bet on upcoming and live matches</p>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search matches..." className="pl-10" />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Date
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 w-full justify-start">
                <TabsTrigger value="all" className="rounded-full">
                  All Matches
                </TabsTrigger>
                <TabsTrigger value="live" className="rounded-full">
                  Live Now
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="rounded-full">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-full">
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 font-heading">Live Matches</h2>
                  <div className="space-y-6">
                    <BettingCard
                      id="CR1001"
                      team1="Mumbai Indians"
                      team1Logo="/team-logos/mi.png"
                      team1Color="blue"
                      team2="Chennai Super Kings"
                      team2Logo="/team-logos/csk.png"
                      team2Color="yellow"
                      team1Odds="1.95"
                      team2Odds="1.85"
                      drawOdds="3.50"
                      timeLeft="32:15"
                      liquidity="$24,560"
                      isLive={true}
                      team1Score="142/3 (15.2)"
                      team2Score="Target: 186"
                      venue="Wankhede Stadium"
                    />

                    <BettingCard
                      id="CR1002"
                      team1="Royal Challengers Bangalore"
                      team1Logo="/team-logos/rcb.png"
                      team1Color="red"
                      team2="Kolkata Knight Riders"
                      team2Logo="/team-logos/kkr.png"
                      team2Color="purple"
                      team1Odds="2.10"
                      team2Odds="1.75"
                      drawOdds="3.80"
                      timeLeft="12:45"
                      liquidity="$18,320"
                      isLive={true}
                      team1Score="95/2 (10.3)"
                      team2Score="Target: 175"
                      venue="M. Chinnaswamy Stadium"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4 font-heading">Upcoming Matches</h2>
                  <div className="space-y-6">
                    <BettingCard
                      id="CR2001"
                      team1="Delhi Capitals"
                      team1Logo="/team-logos/dc.png"
                      team1Color="blue"
                      team2="Rajasthan Royals"
                      team2Logo="/team-logos/rr.png"
                      team2Color="purple"
                      team1Odds="2.05"
                      team2Odds="1.80"
                      drawOdds="3.60"
                      startTime="May 12, 2023 - 19:30 IST"
                      liquidity="$15,780"
                      venue="Arun Jaitley Stadium"
                    />

                    <BettingCard
                      id="CR2002"
                      team1="Punjab Kings"
                      team1Logo="/team-logos/pbks.png"
                      team1Color="red"
                      team2="Sunrisers Hyderabad"
                      team2Logo="/team-logos/srh.png"
                      team2Color="orange"
                      team1Odds="1.95"
                      team2Odds="1.90"
                      drawOdds="3.40"
                      startTime="May 14, 2023 - 15:30 IST"
                      liquidity="$12,450"
                      venue="Punjab Cricket Association Stadium"
                    />

                    <BettingCard
                      id="FB2001"
                      team1="Arsenal"
                      team1Logo="/team-logos/arsenal.png"
                      team1Color="red"
                      team2="Chelsea"
                      team2Logo="/team-logos/chelsea.png"
                      team2Color="blue"
                      team1Odds="1.75"
                      team2Odds="2.15"
                      drawOdds="3.30"
                      startTime="May 13, 2023 - 17:00 GMT"
                      liquidity="$22,340"
                      venue="Emirates Stadium"
                      tournament="Premier League"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="live" className="space-y-6">
                <BettingCard
                  id="CR1001"
                  team1="Mumbai Indians"
                  team1Logo="/team-logos/mi.png"
                  team1Color="blue"
                  team2="Chennai Super Kings"
                  team2Logo="/team-logos/csk.png"
                  team2Color="yellow"
                  team1Odds="1.95"
                  team2Odds="1.85"
                  drawOdds="3.50"
                  timeLeft="32:15"
                  liquidity="$24,560"
                  isLive={true}
                  team1Score="142/3 (15.2)"
                  team2Score="Target: 186"
                  venue="Wankhede Stadium"
                />

                <BettingCard
                  id="CR1002"
                  team1="Royal Challengers Bangalore"
                  team1Logo="/team-logos/rcb.png"
                  team1Color="red"
                  team2="Kolkata Knight Riders"
                  team2Logo="/team-logos/kkr.png"
                  team2Color="purple"
                  team1Odds="2.10"
                  team2Odds="1.75"
                  drawOdds="3.80"
                  timeLeft="12:45"
                  liquidity="$18,320"
                  isLive={true}
                  team1Score="95/2 (10.3)"
                  team2Score="Target: 175"
                  venue="M. Chinnaswamy Stadium"
                />

                <BettingCard
                  id="FB1001"
                  team1="Manchester United"
                  team1Logo="/team-logos/man-utd.png"
                  team1Color="red"
                  team2="Liverpool"
                  team2Logo="/team-logos/liverpool.png"
                  team2Color="red"
                  team1Odds="2.25"
                  team2Odds="1.65"
                  drawOdds="3.20"
                  timeLeft="45:00"
                  liquidity="$32,450"
                  isLive={true}
                  team1Score="1"
                  team2Score="2"
                  venue="Old Trafford"
                  tournament="Premier League"
                />
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-6">
                <BettingCard
                  id="CR2001"
                  team1="Delhi Capitals"
                  team1Logo="/team-logos/dc.png"
                  team1Color="blue"
                  team2="Rajasthan Royals"
                  team2Logo="/team-logos/rr.png"
                  team2Color="purple"
                  team1Odds="2.05"
                  team2Odds="1.80"
                  drawOdds="3.60"
                  startTime="May 12, 2023 - 19:30 IST"
                  liquidity="$15,780"
                  venue="Arun Jaitley Stadium"
                />

                <BettingCard
                  id="CR2002"
                  team1="Punjab Kings"
                  team1Logo="/team-logos/pbks.png"
                  team1Color="red"
                  team2="Sunrisers Hyderabad"
                  team2Logo="/team-logos/srh.png"
                  team2Color="orange"
                  team1Odds="1.95"
                  team2Odds="1.90"
                  drawOdds="3.40"
                  startTime="May 14, 2023 - 15:30 IST"
                  liquidity="$12,450"
                  venue="Punjab Cricket Association Stadium"
                />

                <BettingCard
                  id="FB2001"
                  team1="Arsenal"
                  team1Logo="/team-logos/arsenal.png"
                  team1Color="red"
                  team2="Chelsea"
                  team2Logo="/team-logos/chelsea.png"
                  team2Color="blue"
                  team1Odds="1.75"
                  team2Odds="2.15"
                  drawOdds="3.30"
                  startTime="May 13, 2023 - 17:00 GMT"
                  liquidity="$22,340"
                  venue="Emirates Stadium"
                  tournament="Premier League"
                />
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <BettingCard
                  id="CR3001"
                  team1="Gujarat Titans"
                  team1Logo="/team-logos/gt.png"
                  team1Color="blue"
                  team2="Lucknow Super Giants"
                  team2Logo="/team-logos/lsg.png"
                  team2Color="green"
                  team1Odds="1.00"
                  team2Odds="1.00"
                  drawOdds="1.00"
                  startTime="May 7, 2023 - 19:30 IST"
                  liquidity="$0"
                  venue="Narendra Modi Stadium"
                  team1Score="Final: 144/4 (20)"
                  team2Score="Final: 142/8 (20)"
                />

                <BettingCard
                  id="CR3002"
                  team1="Rajasthan Royals"
                  team1Logo="/team-logos/rr.png"
                  team1Color="purple"
                  team2="Sunrisers Hyderabad"
                  team2Logo="/team-logos/srh.png"
                  team2Color="orange"
                  team1Odds="1.00"
                  team2Odds="1.00"
                  drawOdds="1.00"
                  startTime="May 5, 2023 - 19:30 IST"
                  liquidity="$0"
                  venue="Rajiv Gandhi International Stadium"
                  team1Score="Final: 118 (19.5)"
                  team2Score="Final: 119/4 (18.3)"
                />
              </TabsContent>
            </Tabs>
          </div>
        </FadeInSection>
      </div>

      <Footer />
    </AnimatedBackground>
  )
}
