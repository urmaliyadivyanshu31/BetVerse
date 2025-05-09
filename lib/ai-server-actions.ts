"use server"

import type { ChatCompletionMessageParam } from "ai"

type GrokMessage = {
  role: string
  content: string
}

type GrokResponse = {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

/**
 * Server action to generate Grok completion using direct API calls
 * @param messages - Array of chat messages
 * @returns Promise with the AI response
 */
export async function generateGrokCompletion(messages: ChatCompletionMessageParam[]): Promise<string> {
  try {
    const apiKey = process.env.XAI_API_KEY

    if (!apiKey) {
      throw new Error("XAI_API_KEY is not defined")
    }

    // Format messages for Grok API
    const formattedMessages: GrokMessage[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Make direct API call to Grok
    const response = await fetch("https://api.xai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: formattedMessages,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} ${errorText}`)
    }

    const data: GrokResponse = await response.json()
    return data.choices[0]?.message?.content || "No response generated"
  } catch (error) {
    console.error("Error in server action:", error)
    return "There was an error processing your request. Please try again later."
  }
}
