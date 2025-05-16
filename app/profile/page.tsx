"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Navbar from "@/components/navbar"
import { ArrowUpRight, DollarSign, TrendingUp, Trophy, Wallet, Camera } from "lucide-react"
import TransactionHistory from "@/components/transaction-history"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* User Profile Section */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-gray-800">
              <AvatarImage src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairNotTooLong&accessoriesType=Blank&hairColor=BrownDark&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Pale" alt="User avatar" />
              <AvatarFallback className="bg-gray-800 text-2xl">JD</AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute bottom-0 right-0 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Singupalli Kartik</h1>
                <p className="text-gray-400">@skartik1706</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Member since</span>
                    <span className="text-white">Jan 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Total Bets</span>
                    <span className="text-white">42</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex items-center border-gray-700 text-white hover:bg-gray-800">
                  <DollarSign className="mr-2 h-4 w-4" /> Add Funds
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center">
                  <Wallet className="mr-2 h-4 w-4" /> Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Balance</p>
                  <h3 className="text-2xl font-bold">$1,450.75</h3>
                </div>
                <div className="h-12 w-12 bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Bets</p>
                  <h3 className="text-2xl font-bold">$350.00</h3>
                </div>
                <div className="h-12 w-12 bg-blue-900/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Winnings</p>
                  <h3 className="text-2xl font-bold">$2,780.50</h3>
                </div>
                <div className="h-12 w-12 bg-green-900/20 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-[#1a1a1a] border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">Overview</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gray-800">Betting History</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gray-800">Transactions</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Bet Won</h4>
                          <span className="text-green-500 font-medium">+$45.60</span>
                        </div>
                        <p className="text-sm text-gray-400">Mumbai Indians vs Chennai Super Kings</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Funds Added</h4>
                          <span className="text-green-500 font-medium">+$100.00</span>
                        </div>
                        <p className="text-sm text-gray-500">Via Phantom Wallet</p>
                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Bet Lost</h4>
                          <span className="text-red-500 font-medium">-$25.00</span>
                        </div>
                        <p className="text-sm text-gray-500">Barcelona vs Real Madrid</p>
                        <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:bg-gray-800">
                      View All Activity <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl">Active Bets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">RCB vs KKR</h4>
                        <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-400 rounded-full">Active</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">Bet on: Royal Challengers Bangalore</p>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-400">Amount</p>
                          <p className="font-medium">$150.00</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Odds</p>
                          <p className="font-medium">2.10</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Potential Win</p>
                          <p className="font-medium text-green-500">$315.00</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Man Utd vs Liverpool</h4>
                        <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-400 rounded-full">Active</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">Bet on: Draw</p>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-400">Amount</p>
                          <p className="font-medium">$200.00</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Odds</p>
                          <p className="font-medium">3.20</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Potential Win</p>
                          <p className="font-medium text-green-500">$640.00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:bg-gray-800">
                      View All Active Bets <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Betting History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead>ID</TableHead>
                        <TableHead>Match</TableHead>
                        <TableHead>Bet On</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Odds</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Winnings</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-gray-800">
                        <TableCell className="font-medium">#BET1001</TableCell>
                        <TableCell>MI vs CSK</TableCell>
                        <TableCell>Mumbai Indians</TableCell>
                        <TableCell>$30.00</TableCell>
                        <TableCell>1.95</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Won</span>
                        </TableCell>
                        <TableCell className="text-green-500">+$58.50</TableCell>
                        <TableCell className="text-gray-500 text-sm">May 8, 2023</TableCell>
                      </TableRow>
                      <TableRow className="border-gray-800">
                        <TableCell className="font-medium">#BET1002</TableCell>
                        <TableCell>Barcelona vs Real Madrid</TableCell>
                        <TableCell>Barcelona</TableCell>
                        <TableCell>$25.00</TableCell>
                        <TableCell>2.10</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">Lost</span>
                        </TableCell>
                        <TableCell className="text-red-500">-$25.00</TableCell>
                        <TableCell className="text-gray-500 text-sm">May 5, 2023</TableCell>
                      </TableRow>
                      <TableRow className="border-gray-800">
                        <TableCell className="font-medium">#BET1003</TableCell>
                        <TableCell>Lakers vs Warriors</TableCell>
                        <TableCell>Lakers</TableCell>
                        <TableCell>$50.00</TableCell>
                        <TableCell>1.85</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Won</span>
                        </TableCell>
                        <TableCell className="text-green-500">+$92.50</TableCell>
                        <TableCell className="text-gray-500 text-sm">May 3, 2023</TableCell>
                      </TableRow>
                      <TableRow className="border-gray-800">
                        <TableCell className="font-medium">#BET1004</TableCell>
                        <TableCell>RCB vs SRH</TableCell>
                        <TableCell>Draw</TableCell>
                        <TableCell>$20.00</TableCell>
                        <TableCell>3.50</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">Lost</span>
                        </TableCell>
                        <TableCell className="text-red-500">-$20.00</TableCell>
                        <TableCell className="text-gray-500 text-sm">May 1, 2023</TableCell>
                      </TableRow>
                      <TableRow className="border-gray-800">
                        <TableCell className="font-medium">#BET1005</TableCell>
                        <TableCell>Arsenal vs Chelsea</TableCell>
                        <TableCell>Arsenal</TableCell>
                        <TableCell>$40.00</TableCell>
                        <TableCell>1.75</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Won</span>
                        </TableCell>
                        <TableCell className="text-green-500">+$70.00</TableCell>
                        <TableCell className="text-gray-500 text-sm">Apr 28, 2023</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">Showing 5 of 24 entries</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-orange-50">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start">
                        Personal Information
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Security
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Wallet & Payments
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Notifications
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Privacy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue="John"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue="Parker"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          defaultValue="john.parker@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          defaultValue="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="pt-4">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">Save Changes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
