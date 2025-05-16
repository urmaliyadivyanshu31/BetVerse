"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";
import Image from "next/image";
import AnimatedBackground from "@/components/animated-background";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FadeInSection from "@/components/fade-in-section";

// Mock data for the leaderboard
const leaderboardData = [
  {
    rank: 1,
    wallet: "0x1a3f...dE92",
    avatar:
      "https://avataaars.io/?avatarStyle=Circle&topType=LongHairBigHair&accessoriesType=Blank&hairColor=Black&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=WinkWacky&eyebrowType=DefaultNatural&mouthType=Vomit&skinColor=Light",
    winRate: "78%",
    profit: "$15.29",
    bets: 156,
  },
  {
    rank: 2,
    wallet: "0xb7c9...3A1f",
    avatar:
      "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairDreads02&accessoriesType=Wayfarers&hairColor=Brown&facialHairType=Blank&facialHairColor=Red&clotheType=ShirtVNeck&clotheColor=Gray01&eyeType=Dizzy&eyebrowType=AngryNatural&mouthType=Serious&skinColor=Light",
    winRate: "72%",
    profit: "$12.85",
    bets: 143,
  },
  {
    rank: 3,
    wallet: "0x4e2a...9Bc3",
    avatar:
      "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairTheCaesar&accessoriesType=Blank&hairColor=Blonde&facialHairType=BeardMajestic&facialHairColor=Blonde&clotheType=BlazerSweater&clotheColor=Blue01&eyeType=Wink&eyebrowType=UnibrowNatural&mouthType=Disbelief&skinColor=Tanned",
    winRate: "68%",
    profit: "$11.20",
    bets: 128,
  },
  {
    rank: 4,
    wallet: "0xf14d...7cA0",
    avatar:
      "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat1&accessoriesType=Wayfarers&hatColor=White&hairColor=BlondeGolden&facialHairType=MoustacheMagnum&facialHairColor=Black&clotheType=ShirtVNeck&clotheColor=Heather&eyeType=Hearts&eyebrowType=AngryNatural&mouthType=Concerned&skinColor=Light",
    winRate: "65%",
    profit: "$9.75",
    bets: 117,
  },
  {
    rank: 5,
    wallet: "0xa892...12Ef",
    avatar:
      "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Wayfarers&hatColor=PastelRed&hairColor=Blonde&facialHairType=MoustacheFancy&facialHairColor=BlondeGolden&clotheType=ShirtVNeck&clotheColor=PastelOrange&eyeType=Close&eyebrowType=SadConcernedNatural&mouthType=Tongue&skinColor=Yellow",
    winRate: "60%",
    profit: "$8.10",
    bets: 101,
  },
];

export default function LeaderboardPage() {
  return (
    <AnimatedBackground variant="dots" className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <FadeInSection>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Trophy className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-3xl font-bold">Leaderboard</h1>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Rank</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead className="text-right">Win Rate</TableHead>
                      <TableHead className="text-right">Profit</TableHead>
                      <TableHead className="text-right">Total Bets</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((player) => (
                      <TableRow key={player.rank} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {player.rank === 1 ? (
                              <span className="text-yellow-500 font-bold">
                                🥇 #{player.rank}
                              </span>
                            ) : player.rank === 2 ? (
                              <span className="text-gray-400 font-bold">
                                🥈 #{player.rank}
                              </span>
                            ) : player.rank === 3 ? (
                              <span className="text-amber-600 font-bold">
                                🥉 #{player.rank}
                              </span>
                            ) : (
                              <span className="font-medium">#{player.rank}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <Image
                                src={player.avatar}
                                alt={`Player ${player.rank}`}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{player.wallet}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: player.winRate,
                                }}
                              />
                            </div>
                            <span className="font-medium text-blue-500">
                              {player.winRate}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium text-green-500">
                            {player.profit}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">{player.bets}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </FadeInSection>
      </div>
      <Footer />
    </AnimatedBackground>
  );
}
