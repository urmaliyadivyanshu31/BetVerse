import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Users } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import FadeInSection from "@/components/fade-in-section"

// Mock data for the leaderboard
const leaderboardData = [
  {
    rank: 1,
    username: "CryptoKing",
    avatar: "/avatars/user1.png",
    winRate: "78%",
    profit: "$12,450",
    bets: 156,
  },
  {
    rank: 2,
    username: "BetMaster",
    avatar: "/avatars/user2.png",
    winRate: "72%",
    profit: "$9,870",
    bets: 143,
  },
  {
    rank: 3,
    username: "SolanaPro",
    avatar: "/avatars/user3.png",
    winRate: "68%",
    profit: "$8,320",
    bets: 128,
  },
  // Add more mock data as needed
]

export default function LeaderboardPage() {
  return (
    <AnimatedBackground variant="dots" className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="flex items-center mb-6">
              <Trophy className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-3xl font-bold font-heading">Leaderboard</h1>
            </div>
            <p className="text-muted-foreground mb-8">
              Top performers and most successful bettors on BetVerse
            </p>
          </FadeInSection>

          <FadeInSection delay={200}>
            <Tabs defaultValue="all-time" className="mb-8">
              <TabsList>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
                <TabsTrigger value="weekly">This Week</TabsTrigger>
              </TabsList>

              <TabsContent value="all-time">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Rank</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead className="text-right">Win Rate</TableHead>
                          <TableHead className="text-right">Profit</TableHead>
                          <TableHead className="text-right">Total Bets</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboardData.map((user) => (
                          <TableRow key={user.rank}>
                            <TableCell className="font-medium">#{user.rank}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-primary" />
                                </div>
                                <span>{user.username}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{user.winRate}</TableCell>
                            <TableCell className="text-right text-green-500">{user.profit}</TableCell>
                            <TableCell className="text-right">{user.bets}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monthly">
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Monthly leaderboard data will be available soon
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="weekly">
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Weekly leaderboard data will be available soon
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </FadeInSection>
        </div>
      </div>
      <Footer />
    </AnimatedBackground>
  )
} 