"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar } from "lucide-react";
import BettingCard from "@/components/betting-card";
import AnimatedBackground from "@/components/animated-background";
import FadeInSection from "@/components/fade-in-section";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useWallet } from "@/components/wallet-provider";
import { Transaction, SystemProgram, PublicKey } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { connection } from "@/lib/solana";

type PlacedBet = {
  matchId: string;
  amount: number;
  odds: number;
  timestamp: number;
  team: "team1" | "team2" | "draw";
};

export default function MatchesPage() {
  const { toast } = useToast();
  const { publicKey } = useWallet();
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  // Add state for matchParticipants and matchOdds
  const [matchParticipants, setMatchParticipants] = useState<{
    [matchId: string]: number;
  }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("matchParticipants");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [matchOdds, setMatchOdds] = useState<{
    [matchId: string]: { team1: string; team2: string; draw: string };
  }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("matchOdds");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    const savedBets = localStorage.getItem("placedBets");
    if (savedBets) {
      setPlacedBets(JSON.parse(savedBets));
    }
  }, []);

  const handlePlaceBet = async (
    matchId: string,
    amount: number,
    odds: number,
    team: "team1" | "team2" | "draw"
  ) => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to place a bet",
        variant: "destructive",
      });
      return;
    }

    if (placedBets.some((bet) => bet.matchId === matchId)) {
      toast({
        title: "Bet already placed",
        description: "You have already placed a bet on this match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPlacingBet(true);

      // Create transaction to send SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: new PublicKey(
            "DTAZZC65t9zUCDYL7yXdAAMTZtSa1djmTTFQxnekmQGM"
          ),
          lamports: LAMPORTS_PER_SOL,
        })
      );

      toast({
        title: "Confirm Transaction",
        description: "Please confirm the transaction in your wallet",
        variant: "default",
      });

      // Get the latest blockhash
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = new PublicKey(publicKey);

      // Request wallet signature
      const { solana } = window as any;
      if (!solana) {
        toast({
          title: "Wallet not found",
          description: "Please install a Solana wallet extension",
          variant: "destructive",
        });
        return;
      }

      try {
        const signedTx = await solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTx.serialize()
        );

        toast({
          title: "Transaction sent",
          description: "Waiting for confirmation...",
          variant: "default",
        });

        await connection.confirmTransaction(signature);

        const newBet: PlacedBet = {
          matchId,
          amount,
          odds,
          timestamp: Date.now(),
          team,
        };

        // Update participants count
        const currentParticipants = matchParticipants[matchId] || 0;
        const updatedParticipants = {
          ...matchParticipants,
          [matchId]: currentParticipants + 1,
        };
        setMatchParticipants(updatedParticipants);
        localStorage.setItem(
          "matchParticipants",
          JSON.stringify(updatedParticipants)
        );

        // Update odds (simplified example - you might want more complex odds calculation)
        const currentOdds = matchOdds[matchId] || {
          team1: "2.00",
          team2: "2.00",
          draw: "3.00",
        };
        const updatedOdds = {
          ...matchOdds,
          [matchId]: {
            ...currentOdds,
            [team]: (parseFloat(currentOdds[team]) - 0.05).toFixed(2), // Decrease odds slightly
          },
        };
        setMatchOdds(updatedOdds);
        localStorage.setItem("matchOdds", JSON.stringify(updatedOdds));

        // Update placed bets
        const updatedBets = [...placedBets, newBet];
        setPlacedBets(updatedBets);
        localStorage.setItem("placedBets", JSON.stringify(updatedBets));

        toast({
          title: "Bet placed successfully! 🎉",
          description: "Your transaction has been confirmed",
          variant: "default",
        });
      } catch (err) {
        toast({
          title: "Transaction cancelled",
          description: "The transaction was cancelled by the user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      toast({
        title: "Error placing bet",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsPlacingBet(false);
    }
  };

  const hasBetPlaced = (matchId: string) => {
    return placedBets.some((bet) => bet.matchId === matchId);
  };

  return (
    <AnimatedBackground variant="dots" className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <FadeInSection>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 font-heading">Matches</h1>
            <p className="text-muted-foreground mb-8">
              Browse and bet on upcoming and live matches
            </p>

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
                  <h2 className="text-xl font-bold mb-4 font-heading">
                    Live Matches
                  </h2>
                  <div className="space-y-6">
                    <BettingCard
                      id="CR1001"
                      team1="India"
                      team1Logo="https://media-hosting.imagekit.io/74c4b80444da42e8/Board_of_Control_for_Cricket_in_India_Logo_(2024).svg?Expires=1841939589&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=uY5FGDDJG5EPp~foAYhNd-A21MuoY2K5AIC6s5Nchzacg6rHtDQhGt6nxHh6rTXyQwd5h8MHZJPiVX3WvsnRVF45w6mGk9uogeg918n-7CkvCgz9CgqU7PWKImB-WyLvU7Nx2xM8n-Ct2eqGKMHrBKZK9AfZgJEuzRm53xjnuztBoSFLB~lquabWPRrsXPPXUTni7t5fJIhRAoQMzKtrTGhrvAjMyxOvYfvbWmpS4wybE83RPF0~p3aNg4Rw4VowIJSYkfLc8FQK28QI4nMNBufuS4o6dpVGWkTtbg5Zsf9uxCEu3hPkjm7--hiAF1taqnG3FK440Phryk05wA5Vhw__"
                      team1Color="blue"
                      team2="Australia"
                      team2Logo="https://media-hosting.imagekit.io/dbecdefbdee642d8/Cricket_Australia.png?Expires=1841939641&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=uPCW8E8sk8kL8F9Kqj1-0CUEQ94ua1MX9ga9ZYtEJK7SlE96eayzzzEWE5SlcYoEyCTR~nu-WAXdIlSxGRrZjcrd~x7vRR9UUNpgtho-dpFwIV3SrjP9xT2931ab7mdsC7AtYbf7zWL8HjzCsL8HAPwPHopFBdd47xAP6pl5KUfRACcjlFTfw~Qm-t-oaa2m-mVxtNjRLm-xNAUuuxsSbBsRMD5SuW42vNcQ5eZqvlz61ExlfJiamug~ulbkfKNCuAUxFCHdzYq--AnKYsUwCTBA7aNsbUIYBExY~xjbeOV19XY-hQt75RdkzDlu5sucYTOwkotWlgQu-AexYhzaKw__"
                      team2Color="yellow"
                      team1Odds={matchOdds["CR1001"]?.team1 || "1.95"}
                      team2Odds={matchOdds["CR1001"]?.team2 || "1.85"}
                      drawOdds={matchOdds["CR1001"]?.draw || "3.50"}
                      timeLeft="32:15"
                      liquidity="$24,560"
                      isLive={true}
                      team1Score="142/3 (15.2)"
                      team2Score="Target: 186"
                      venue="Wankhede Stadium"
                      participants={matchParticipants["CR1001"] || 0}
                      isDisabled={hasBetPlaced("CR1001")}
                      betPlaced={hasBetPlaced("CR1001")}
                      onPlaceBet={handlePlaceBet}
                      isPlacingBet={isPlacingBet}
                    />

                    <BettingCard
                      id="CR1002"
                      team1="Royal Challengers Bangalore"
                      team1Logo="https://media-hosting.imagekit.io/c4a7bba832f34a56/screenshot_1747368167104.png?Expires=1841976170&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=pQq45~aYDwagu2TfBm1wwDBGSXuvjsZoe6o6~rZJYUsrEacaNWVVZvkh7YeDiIA3qugSWi4TBinen6KSSdOYMhtAsGCeTs7H8yMb7zn1y9BJfi1Xq-2swFsK-KsXoRKJbUQVB6VrBYAL~MONiP9kpItJRwgqE0BSkW2a2jCnCp8iIZZqEZZoqvSaEwS4nV9aNagGlAzcPlSwBhVDlDHGUke4K1Qd~HGV8P9GGMHFNmrkUh6~IO1WY4eonNPhLEcvLL7Azkg5GR0ZaALo1htV6lF82v7BM0pF3DVlIF2EhKp8ipAVW-ADUFvPUjJZo0lsBhfbdF1P~tK49KSCn29trQ__"
                      team1Color="red"
                      team2="Kolkata Knight Riders"
                      team2Logo="https://media-hosting.imagekit.io/a838787683514c69/screenshot_1747368176857.png?Expires=1841976179&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=EdkCjMM21IXOU2yfmdiBnIiI565nqDbo8QzngFQrxxpL2MEBIP0Bt0sUP1hypJdHFG80ANDIfadgMtIcJQbcv72lX0a2EO5yUS8FtmhLZvNqoBSrzQgTO8DJteA5h4Whkjs5kIdTTnt3LLJgW4p~TmJJ~wiyPU22jLCrump2AQ8kYT2SS0sNvJVyvW6bRxFX82Yyf9T4wMwZ~Rjm~92PArdiuoFVl2DOdr7LmMieR63wwg4Y2flD~H18z36KUOFaaX1H~2Vho6pgrWg4-fHdMYUlUJ5wYeG~W-9Sg-Ug2mcgbOEHI1KOLP-Jn3LSzdFPzlRQC0EaKwmOzOlf2sHdeg__"
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
                      participants={matchParticipants["CR1002"] || 0} // Add this line
                      isDisabled={hasBetPlaced("CR1002")}
                      betPlaced={hasBetPlaced("CR1002")}
                      onPlaceBet={handlePlaceBet}
                      isPlacingBet={isPlacingBet}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4 font-heading">
                    Upcoming Matches
                  </h2>
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
                      participants={matchParticipants["CR2001"] || 0}
                      isDisabled={hasBetPlaced("CR2001")}
                      betPlaced={hasBetPlaced("CR2001")}
                      onPlaceBet={handlePlaceBet}
                      isPlacingBet={isPlacingBet}
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
                      participants={matchParticipants["CR2002"] || 0}
                      isDisabled={hasBetPlaced("CR2002")}
                      betPlaced={hasBetPlaced("CR2002")}
                      onPlaceBet={handlePlaceBet}
                      isPlacingBet={isPlacingBet}
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
                      participants={matchParticipants["FB2001"] || 0}
                      isDisabled={hasBetPlaced("FB2001")}
                      betPlaced={hasBetPlaced("FB2001")}
                      onPlaceBet={handlePlaceBet}
                      isPlacingBet={isPlacingBet}
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
                  participants={matchParticipants["CR1001"] || 0}
                  isDisabled={hasBetPlaced("CR1001")}
                  betPlaced={hasBetPlaced("CR1001")}
                  onPlaceBet={handlePlaceBet}
                  isPlacingBet={isPlacingBet}
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
                  participants={matchParticipants["CR1002"] || 0}
                  isDisabled={hasBetPlaced("CR1002")}
                  betPlaced={hasBetPlaced("CR1002")}
                  onPlaceBet={handlePlaceBet}
                  isPlacingBet={isPlacingBet}
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
                  participants={matchParticipants["CR1001"] || 0}
                  team2Score="2"
                  venue="Old Trafford"
                  tournament="Premier League"
                  isDisabled={hasBetPlaced("FB1001")}
                  betPlaced={hasBetPlaced("FB1001")}
                  onPlaceBet={handlePlaceBet}
                  isPlacingBet={isPlacingBet}
                />
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-6">
                <BettingCard
                  id="CR2001"
                  participants={matchParticipants["CR1001"] || 0}
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
                  isDisabled={hasBetPlaced("CR2001")}
                  betPlaced={hasBetPlaced("CR2001")}
                  onPlaceBet={handlePlaceBet}
                  isPlacingBet={isPlacingBet}
                />

                <BettingCard
                  id="CR2002"
                  team1="Punjab Kings"
                  participants={matchParticipants["CR1001"] || 0}
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
                  isDisabled={hasBetPlaced("CR2002")}
                  betPlaced={hasBetPlaced("CR2002")}
                  onPlaceBet={handlePlaceBet}
                  isPlacingBet={isPlacingBet}
                />

                <BettingCard
                  id="FB2001"
                  team1="Arsenal"
                  team1Logo="/team-logos/arsenal.png"
                  participants={matchParticipants["CR1001"] || 0}
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
                  isDisabled={hasBetPlaced("FB2001")}
                  betPlaced={hasBetPlaced("FB2001")}
                  onPlaceBet={handlePlaceBet}
                  isPlacingBet={isPlacingBet}
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
                  participants={matchParticipants["CR1001"] || 0}
                  team2Color="green"
                  team1Odds="1.00"
                  team2Odds="1.00"
                  drawOdds="1.00"
                  startTime="May 7, 2023 - 19:30 IST"
                  liquidity="$0"
                  venue="Narendra Modi Stadium"
                  team1Score="Final: 144/4 (20)"
                  team2Score="Final: 142/8 (20)"
                  isDisabled={hasBetPlaced("CR3001")}
                  betPlaced={hasBetPlaced("CR3001")}
                  onPlaceBet={handlePlaceBet}
                  isPlacingBet={isPlacingBet}
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
                  participants={matchParticipants["CR1001"] || 0}
                  team2Odds="1.00"
                  drawOdds="1.00"
                  startTime="May 5, 2023 - 19:30 IST"
                  liquidity="$0"
                  venue="Rajiv Gandhi International Stadium"
                  team1Score="Final: 118 (19.5)"
                  team2Score="Final: 119/4 (18.3)"
                  isDisabled={hasBetPlaced("CR3002")}
                  betPlaced={hasBetPlaced("CR3002")}
                  onPlaceBet={handlePlaceBet}
                  isPlacingBet={isPlacingBet}
                />
              </TabsContent>
            </Tabs>
          </div>
        </FadeInSection>
      </div>

      <Footer />
    </AnimatedBackground>
  );
}
