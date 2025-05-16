"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import {
  Clock,
  Zap,
  ChevronRight,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import { useWallet } from "./wallet-provider";
import Image from "next/image";
import Link from "next/link";

interface BettingCardProps {
  id: string;
  team1: string;
  team1Logo: string;
  team1Color: string;
  team2: string;
  team2Logo: string;
  team2Color: string;
  team1Odds: string;
  team2Odds: string;
  drawOdds: string;
  timeLeft?: string;
  startTime?: string;
  liquidity: string;
  isLive?: boolean;
  team1Score?: string;
  team2Score?: string;
  venue?: string;
  tournament?: string;
  popularity?: number;
  participants: number;
  onPlaceBet: (
    matchId: string,
    amount: number,
    odds: number,
    team: "team1" | "team2" | "draw"
  ) => Promise<void>;
  isPlacingBet: boolean;
  isDisabled?: boolean;
  betPlaced?: boolean;
}

export default function BettingCard({
  id,
  team1,
  team1Logo,
  team1Color,
  team2,
  team2Logo,
  team2Color,
  team1Odds,
  team2Odds,
  drawOdds,
  timeLeft,
  startTime,
  liquidity,
  isLive = false,
  team1Score,
  team2Score,
  venue,
  tournament = "IPL 2023",
  popularity = 0,
  participants,
  onPlaceBet,
  isPlacingBet,
  isDisabled,
  betPlaced,
}: BettingCardProps) {
  const { isConnected, placeBet } = useWallet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState("50");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedOdds, setSelectedOdds] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      red: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      yellow: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      purple: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      green: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    };
    return colorMap[color] || "bg-primary/10 text-primary hover:bg-primary/20";
  };

  const getTextColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "text-blue-500",
      red: "text-red-500",
      yellow: "text-yellow-500",
      purple: "text-purple-500",
      green: "text-green-500",
    };
    return colorMap[color] || "text-primary";
  };

  const team1ColorClass = getColorClass(team1Color);
  const team2ColorClass = getColorClass(team2Color);
  const team1TextColorClass = getTextColorClass(team1Color);
  const team2TextColorClass = getTextColorClass(team2Color);

  const handlePlaceBet = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to place a bet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const amount = Number.parseFloat(betAmount);
      const odds = Number.parseFloat(selectedOdds);
      const team = selectedTeam;

      const success = await placeBet(amount, id, team, odds);

      if (success) {
        setBetAmount("50");
        setSelectedTeam("");
        setSelectedOdds("");
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      toast({
        title: "Bet Failed",
        description: "There was an error placing your bet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openBetDialog = (team: string, odds: string) => {
    setSelectedTeam(team);
    setSelectedOdds(odds);
    setDialogOpen(true);
  };

  const handleBetSubmit = async (odds: number) => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    await onPlaceBet(
      id,
      amount,
      odds,
      selectedTeam as "team1" | "team2" | "draw"
    );
    setBetAmount("");
  };

  return (
    <Card className="bet-card overflow-hidden border-border hover:shadow-md transition-all duration-300">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              {isLive ? (
                <div className="flex items-center space-x-2">
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-sm font-medium text-red-500">LIVE</span>
                </div>
              ) : (
                <div className="px-2 py-1 rounded-full bg-secondary text-xs font-medium">
                  {tournament}
                </div>
              )}
              <span className="text-sm text-muted-foreground">Match #{id}</span>
            </div>
            <div className="flex items-center space-x-2">
              {isLive ? (
                <>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{timeLeft}</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{startTime}</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-6">
            <div className="col-span-3 text-center">
              <div className="relative w-16 h-16 mx-auto mb-3 team-logo">
                <div
                  className={`absolute inset-0 ${
                    team1Color === "blue"
                      ? "bg-blue-500/10"
                      : team1Color === "red"
                      ? "bg-red-500/10"
                      : team1Color === "yellow"
                      ? "bg-yellow-500/10"
                      : team1Color === "purple"
                      ? "bg-purple-500/10"
                      : "bg-primary/10"
                  } rounded-full`}
                ></div>
                <div className="relative h-full w-full rounded-full bg-card border border-border flex items-center justify-center">
                  <Image
                    src={
                      team1Logo ||
                      `/placeholder.svg?height=40&width=40&query=${team1}`
                    }
                    alt={team1}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
              <h4 className="font-medium font-heading">{team1}</h4>
              {isLive && team1Score && (
                <p className="text-sm text-muted-foreground mt-1">
                  {team1Score}
                </p>
              )}
            </div>

            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-muted-foreground">VS</div>
              {venue && (
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {venue}
                </p>
              )}
            </div>

            <div className="col-span-3 text-center">
              <div className="relative w-16 h-16 mx-auto mb-3 team-logo">
                <div
                  className={`absolute inset-0 ${
                    team2Color === "blue"
                      ? "bg-blue-500/10"
                      : team2Color === "red"
                      ? "bg-red-500/10"
                      : team2Color === "yellow"
                      ? "bg-yellow-500/10"
                      : team2Color === "purple"
                      ? "bg-purple-500/10"
                      : "bg-primary/10"
                  } rounded-full`}
                ></div>
                <div className="relative h-full w-full rounded-full bg-card border border-border flex items-center justify-center">
                  <Image
                    src={
                      team2Logo ||
                      `/placeholder.svg?height=40&width=40&query=${team2}`
                    }
                    alt={team2}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
              <h4 className="font-medium font-heading">{team2}</h4>
              {isLive && team2Score && (
                <p className="text-sm text-muted-foreground mt-1">
                  {team2Score}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              variant="outline"
              className={`flex flex-col items-center justify-center h-20 hover:${team1ColorClass}`}
              onClick={() => openBetDialog(team1, team1Odds)}
            >
              <span className="text-sm text-muted-foreground">Back</span>
              <span className={`text-xl font-bold ${team1TextColorClass}`}>
                {team1Odds}
              </span>
              <span className="text-xs text-muted-foreground">
                {team1.split(" ")[0]}
              </span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20 hover:bg-primary/5 hover:border-primary/50"
              onClick={() => openBetDialog("Draw", drawOdds)}
            >
              <span className="text-sm text-muted-foreground">Draw</span>
              <span className="text-xl font-bold text-primary">{drawOdds}</span>
              <span className="text-xs text-muted-foreground">X</span>
            </Button>
            <Button
              variant="outline"
              className={`flex flex-col items-center justify-center h-20 hover:${team2ColorClass}`}
              onClick={() => openBetDialog(team2, team2Odds)}
            >
              <span className="text-sm text-muted-foreground">Back</span>
              <span className={`text-xl font-bold ${team2TextColorClass}`}>
                {team2Odds}
              </span>
              <span className="text-xs text-muted-foreground">
                {team2.split(" ")[0]}
              </span>
            </Button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {participants} Participants
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Liquidity: {liquidity}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-primary mr-2" />
              <span className="text-muted-foreground">
                Liquidity:{" "}
                <span className="font-medium text-foreground">{liquidity}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowStats(!showStats)}
              >
                {showStats ? "Hide Stats" : "Show Stats"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-primary"
                asChild
              >
                <Link href={`/matches/${id}`}>
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {showStats && (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 animate-fade-in">
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <TrendingUp className="h-4 w-4 text-primary mr-1" />
                  <span className="text-xs font-medium">Trend</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      team1Color === "blue"
                        ? "bg-blue-500"
                        : team1Color === "red"
                        ? "bg-red-500"
                        : team1Color === "yellow"
                        ? "bg-yellow-500"
                        : team1Color === "purple"
                        ? "bg-purple-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${60}%` }}
                  ></div>
                </div>
                <div className="flex justify-between w-full mt-1 text-xs text-muted-foreground">
                  <span>{team1.split(" ")[0]}</span>
                  <span>{team2.split(" ")[0]}</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 text-primary mr-1" />
                  <span className="text-xs font-medium">Popularity</span>
                </div>
                <div className="text-lg font-bold">
                  {popularity || Math.floor(Math.random() * 100) + 1}%
                </div>
                <div className="text-xs text-muted-foreground">
                  of users betting
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <AlertCircle className="h-4 w-4 text-primary mr-1" />
                  <span className="text-xs font-medium">Risk Level</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="h-2 w-2 rounded-full bg-secondary"></span>
                  <span className="h-2 w-2 rounded-full bg-secondary"></span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Medium</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Place a Bet</DialogTitle>
            <DialogDescription>
              You are about to place a bet on {selectedTeam} with odds of{" "}
              {selectedOdds}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (USDC)</label>
              <div className="relative">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="pl-8"
                  placeholder="Enter bet amount"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Bet Amount</label>
                <span className="text-sm text-muted-foreground">$500 max</span>
              </div>
              <Slider
                defaultValue={[50]}
                max={500}
                step={10}
                value={[Number(betAmount) || 0]}
                onValueChange={(value) => setBetAmount(value[0].toString())}
                className="py-2"
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount("50")}
                >
                  $50
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount("100")}
                >
                  $100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount("200")}
                >
                  $200
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount("500")}
                >
                  $500
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bet Summary</label>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your bet</span>
                  <span>${betAmount || "0"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Odds</span>
                  <span>{selectedOdds}x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span>$0 (0%)</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-medium">
                  <span>Potential win</span>
                  <span className="text-green-500">
                    $
                    {betAmount
                      ? (
                          Number.parseFloat(betAmount) *
                          Number.parseFloat(selectedOdds)
                        ).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleBetSubmit(parseFloat(team1Odds))}
              className="glow-on-hover"
              disabled={isPlacingBet}
            >
              {isPlacingBet ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                "Place Bet"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {betPlaced ? (
        <div className="bg-muted p-3 rounded-lg text-center">
          <p className="text-sm font-medium">You have already placed a bet</p>
        </div>
      ) : (
        <Button
          onClick={() => {
            const amount = parseFloat(betAmount);
            const odds = parseFloat(selectedOdds);
            if (!isNaN(amount) && !isNaN(odds)) {
              onPlaceBet(
                id,
                amount,
                odds,
                selectedTeam as "team1" | "team2" | "draw"
              );
            } else {
              toast({
                title: "Invalid Bet",
                description: "Please select a team and enter a valid amount.",
                variant: "destructive",
              });
            }
          }}
          disabled={isDisabled || isPlacingBet}
          className="w-full"
        >
          {isPlacingBet ? "Placing Bet..." : "Place Bet"}
        </Button>
      )}
    </Card>
  );
}
