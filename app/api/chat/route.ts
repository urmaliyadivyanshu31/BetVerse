import { NextResponse } from "next/server"

// Mock responses for different types of queries
const MOCK_RESPONSES = {
  default: "I'm your AI betting assistant. I can help you analyze matches, provide betting insights, and answer questions about sports betting. What would you like to know?",
  prediction: "Based on recent performance and statistics, I would suggest considering the following factors for your bet: team form, head-to-head record, and current odds. Remember to bet responsibly and never bet more than you can afford to lose.",
  strategy: "Here's a basic betting strategy: 1) Set a budget and stick to it 2) Research thoroughly before placing bets 3) Consider value bets rather than just favorites 4) Keep track of your bets and analyze your performance. Would you like more specific advice for a particular match?",
  analysis: "When analyzing a match, I look at: recent form, team statistics, player availability, historical performance, and current odds. I can provide a detailed analysis for any specific match you're interested in.",
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1].content.toLowerCase()

    // Determine response based on message content
    let response = MOCK_RESPONSES.default
    if (lastMessage.includes("predict") || lastMessage.includes("prediction")) {
      response = MOCK_RESPONSES.prediction
    } else if (lastMessage.includes("strategy") || lastMessage.includes("how to bet")) {
      response = MOCK_RESPONSES.strategy
    } else if (lastMessage.includes("analyze") || lastMessage.includes("analysis")) {
      response = MOCK_RESPONSES.analysis
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({ content: response })
  } catch (error) {
    console.error("Error in chat API route:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
} 