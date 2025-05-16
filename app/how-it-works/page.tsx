import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Wallet,
  Shield,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/animated-background";
import FadeInSection from "@/components/fade-in-section";

export default function HowItWorksPage() {
  return (
    <AnimatedBackground variant="dots" className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <h1 className="text-4xl font-bold mb-6 font-heading">
              How Under_score Works
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Learn how to get started with decentralized sports betting on
              Under_score
            </p>
          </FadeInSection>

          <div className="space-y-12">
            <FadeInSection delay={200}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2 font-heading">
                        1. Connect Your Wallet
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Start by connecting your Solana wallet to Under_score.
                        We support popular wallets like Phantom, Solflare, and
                        more. Your funds remain in your control at all times.
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="/matches">
                          Connect Wallet <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>

            <FadeInSection delay={400}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2 font-heading">
                        2. Fund Your Account
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Add funds to your account using USDC or SOL. Our
                        platform uses automated market making to ensure fair
                        odds and liquidity for all matches.
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="/add-funds">
                          Add Funds <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>

            <FadeInSection delay={600}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2 font-heading">
                        3. Place Your Bets
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Browse upcoming matches, analyze odds, and place your
                        bets. Our AI assistant can help you make informed
                        decisions with data-driven insights.
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="/matches">
                          View Matches <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>

            <FadeInSection delay={800}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2 font-heading">
                        4. Track and Withdraw
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Monitor your bets in real-time, track your winnings, and
                        withdraw your funds anytime. All transactions are
                        transparent and secure on the Solana blockchain.
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="/profile">
                          View Profile <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>

          <FadeInSection delay={1000}>
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4 font-heading">
                Ready to Start Betting?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of users already betting on Under_score. Get
                started today!
              </p>
              <Button size="lg" className="glow-on-hover" asChild>
                <Link href="/matches">
                  Start Betting <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </div>
      <Footer />
    </AnimatedBackground>
  );
}
