"use client"

import { generateGrokCompletion } from "./ai-server-actions"

// Basic system prompt for the betting assistant
const BETTING_ASSISTANT_PROMPT = `You are an AI betting assistant for a decentralized sports betting platform.
You provide analysis, predictions, and betting advice based on historical data and current match information.
You should explain your reasoning and provide context for your predictions.
Always remind users that betting involves risk and they should bet responsibly.
Never guarantee results, only provide probabilities and insights.`

// Team and sport specific prompts can be added for more context
const CRICKET_PROMPT = `You are knowledgeable about cricket, especially the IPL, including teams, players, historical performance, pitch conditions, and match dynamics.`
const FOOTBALL_PROMPT = `You are knowledgeable about football, including major leagues, teams, players, historical performance, and match dynamics.`
const BASKETBALL_PROMPT = `You are knowledgeable about basketball, including the NBA, teams, players, historical performance, and game dynamics.`

// Types for chat messages
export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

/**
 * Generate a chat completion using the Grok API
 * @param messages - Array of chat messages
 * @param sport - Optional sport to add context (cricket, football, basketball)
 * @returns Promise with the AI response
 */
export async function generateChatCompletion(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate chat completion")
    }

    const data = await response.json()
    return data.content
  } catch (error) {
    console.error("Error in generateChatCompletion:", error)
    throw error
  }
}

// Function to get match prediction
export async function generateMatchPrediction(
  team1: string,
  team2: string,
  sport: "cricket" | "football" | "basketball",
  matchDetails?: string,
): Promise<string> {
  const prompt = `Please analyze the upcoming match between ${team1} and ${team2} (${sport}).
  ${matchDetails ? `Additional match details: ${matchDetails}` : ""}
  Provide a prediction with reasoning, probability analysis, and key factors that could influence the outcome.`

  return generateChatCompletion([{ role: "user", content: prompt }], sport)
}

// Function to get betting strategy
export async function generateBettingStrategy(
  team1: string,
  team2: string,
  team1Odds: string,
  team2Odds: string,
  drawOdds?: string,
  sport?: "cricket" | "football" | "basketball",
): Promise<string> {
  const prompt = `For the match between ${team1} (odds: ${team1Odds}) and ${team2} (odds: ${team2Odds})${
    drawOdds ? ` with draw odds of ${drawOdds}` : ""
  }, suggest a betting strategy.
  Consider value bets, hedging opportunities, and risk management. 
  Explain the reasoning behind your suggestions.`

  return generateChatCompletion([{ role: "user", content: prompt }], sport)
}
