import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import AnimatedBackground from "@/components/animated-background"
import FadeInSection from "@/components/fade-in-section"

export default function FAQPage() {
  return (
    <AnimatedBackground variant="dots" className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <h1 className="text-4xl font-bold mb-6 font-heading">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Find answers to common questions about BetVerse
            </p>
          </FadeInSection>

          <FadeInSection delay={200}>
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="what-is-betverse">
                    <AccordionTrigger>What is BetVerse?</AccordionTrigger>
                    <AccordionContent>
                      BetVerse is a decentralized sports betting platform built on the Solana blockchain. We offer
                      automated market making, fair odds, and transparent betting for various sports including cricket,
                      football, and basketball.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="how-to-start">
                    <AccordionTrigger>How do I start betting?</AccordionTrigger>
                    <AccordionContent>
                      To start betting on BetVerse, you need to:
                      1. Connect your Solana wallet
                      2. Add funds using USDC or SOL
                      3. Browse available matches
                      4. Place your bets
                      Visit our How it Works page for a detailed guide.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="supported-wallets">
                    <AccordionTrigger>Which wallets are supported?</AccordionTrigger>
                    <AccordionContent>
                      We support all major Solana wallets including Phantom, Solflare, and Slope. Make sure your wallet
                      is connected to the Solana mainnet.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="fees">
                    <AccordionTrigger>What are the platform fees?</AccordionTrigger>
                    <AccordionContent>
                      BetVerse charges a minimal platform fee of 0.1% on all bets. This fee is used to maintain the
                      platform and ensure liquidity for all matches.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="withdrawals">
                    <AccordionTrigger>How do withdrawals work?</AccordionTrigger>
                    <AccordionContent>
                      You can withdraw your funds at any time through your profile page. Withdrawals are processed
                      instantly on the Solana blockchain. There are no withdrawal fees.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="ai-assistant">
                    <AccordionTrigger>How does the AI assistant work?</AccordionTrigger>
                    <AccordionContent>
                      Our AI assistant uses advanced machine learning to analyze match data, team performance, and
                      historical records to provide betting insights and predictions. The AI can help you make more
                      informed betting decisions.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="responsible-gambling">
                    <AccordionTrigger>What about responsible gambling?</AccordionTrigger>
                    <AccordionContent>
                      We promote responsible gambling and provide tools to help users manage their betting activity.
                      Users can set deposit limits, take breaks, or self-exclude if needed. Always bet responsibly and
                      never bet more than you can afford to lose.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </FadeInSection>
        </div>
      </div>
      <Footer />
    </AnimatedBackground>
  )
} 