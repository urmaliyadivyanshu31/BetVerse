'use client'

import type { JSX, ReactNode } from 'react';
import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Sparkles, HelpCircle, BarChart2, TrendingUp, History, 
         MessagesSquare, RefreshCw } from "lucide-react"
import { generateChatCompletion, type ChatMessage } from "@/lib/ai-client"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Types for our component state
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantResponse {
  content: string;
  error?: string;
}

// Risk level metadata for visual indicators
const RISK_LEVELS = {
  LOW: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Low Risk' },
  MEDIUM: { color: 'bg-yellow-100 text-yellow-800', icon: '🟡', label: 'Medium Risk' },
  HIGH: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'High Risk' }
} as const;

interface RiskBadgeProps {
  level: keyof typeof RISK_LEVELS;
  className?: string;
}

const RiskBadge = ({ level, className }: RiskBadgeProps) => {
  const { color, icon, label } = RISK_LEVELS[level];
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${color} ${className}`}>
      {icon} {label}
    </span>
  );
};

const formatAIResponse = (content: string): JSX.Element => {
  const sections = [
    { label: 'Match Analysis', regex: /Match Analysis|Analysis|Short Analysis/i, icon: '📊' },
    { label: 'Recommended Bets', regex: /Recommended Bet|Recommended Bets|Suggested Bet|Bet Types/i, icon: '🎯' },
    { label: 'Risk Level', regex: /Risk Level|Risk Rating/i, icon: '⚠️' },
    { label: 'Justification', regex: /Justification|Reasoning|Rationale/i, icon: '🤔' },
    { label: 'Disclaimer', regex: /Disclaimer|Note|Important/i, icon: '⚠️' }
  ];
  
  let formattedContent = content;
  
  // Replace section headers with styled versions
  sections.forEach(section => {
    formattedContent = formattedContent.replace(
      new RegExp(`(${section.label}|${section.regex.source})[:\\s]*`, 'i'),
      `<div class="flex items-center gap-2 font-bold text-primary mt-4 mb-2 bg-primary/5 p-2 rounded-md">
        <span>${section.icon}</span>
        <span>${section.label}:</span>
      </div>`
    );
  });
  
  // Style risk levels with custom component markup
  formattedContent = formattedContent
    .replace(/🟢\s*Low Risk/g, '<div class="risk-badge low">🟢 Low Risk</div>')
    .replace(/🟡\s*Medium Risk/g, '<div class="risk-badge medium">🟡 Medium Risk</div>')
    .replace(/🔴\s*High Risk/g, '<div class="risk-badge high">🔴 High Risk</div>');
  
  // Style odds and statistics
  formattedContent = formattedContent
    .replace(/(\d+(?:\.\d+)?%)/g, '<span class="text-primary font-semibold">$1</span>')
    .replace(/(\d+\.\d+)(?:\s*odds)/g, '<span class="font-mono text-primary">$1</span>');
  
  // Style key match details
  formattedContent = formattedContent.replace(
    /(Head-to-head|Recent Form|Key Stats|Team News):/g,
    '<span class="font-semibold text-primary">$1:</span>'
  );
  
  // Convert line breaks and lists
  formattedContent = formattedContent
    .replace(/\n\s*•/g, '<br>• ')
    .replace(/\n/g, '<br>');
  
  return (
    <div className="prose prose-sm max-w-none [&_.risk-badge]:inline-flex [&_.risk-badge]:items-center [&_.risk-badge]:px-2 [&_.risk-badge]:py-1 [&_.risk-badge]:rounded-full [&_.risk-badge]:text-sm [&_.risk-badge.low]:bg-green-100 [&_.risk-badge.low]:text-green-800 [&_.risk-badge.medium]:bg-yellow-100 [&_.risk-badge.medium]:text-yellow-800 [&_.risk-badge.high]:bg-red-100 [&_.risk-badge.high]:text-red-800">
      <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
    </div>
  );
};

interface AIBettingAssistantProps {
  className?: string;
  initialContext?: string;
  sport?: string;
  compact?: boolean;
}

interface Suggestion {
  text: string;
  icon: ReactNode;
}

const SUGGESTIONS: Suggestion[] = [
  {
    text: "Predict MI vs CSK",
    icon: <BarChart2 className="h-4 w-4 text-primary" />,
  },
  {
    text: "Is this a good bet?",
    icon: <HelpCircle className="h-4 w-4 text-primary" />,
  },
  {
    text: "Betting strategies",
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    text: "Match analysis",
    icon: <History className="h-4 w-4 text-primary" />,
  },
];

export default function AIBettingAssistant({ className, initialContext, sport, compact = false }: AIBettingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI betting assistant. How can I help you analyze matches and make informed betting decisions today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to state
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and set loading state
    setInput('');
    setIsLoading(true);
    
    try {
      // Call API
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI assistant');
      }
      
      const data = await response.json() as AIAssistantResponse;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add AI response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle clicking on suggested questions
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const clearChat = () => {
    setMessages([messages[0]]);
    setInput("");
  };

  // Function to render each message
  const renderMessage = (message: Message, index: number) => {
    return (
      <div
        key={index}
        className={`flex items-start gap-3 ${
          message.role === 'user' ? 'flex-row-reverse' : ''
        }`}
      >
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${
            message.role === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          {message.role === 'user' ? (
            <User className="h-4 w-4" />
          ) : (
            <Avatar>
              <AvatarImage src="/ai-assistant-avatar.png" alt="AI" />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div
          className={`rounded-lg p-3 max-w-[80%] ${
            message.role === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          <div className="prose prose-sm dark:prose-invert">
            {message.role === 'assistant' 
              ? formatAIResponse(message.content)
              : <p>{message.content}</p>
            }
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("flex flex-col", compact ? "h-[600px]" : "h-full", className)}>
      <CardHeader className="px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/ai-assistant-avatar.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">AI Betting Assistant</CardTitle>
              <p className="text-xs text-muted-foreground">Powered by advanced AI</p>
            </div>
          </div>
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 mb-4">
          {messages.map((message, index) => renderMessage(message, index))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bot className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Analyzing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {SUGGESTIONS.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center justify-start gap-2 h-auto p-3 text-left"
                onClick={() => handleSuggestedQuestion(suggestion.text)}
              >
                {suggestion.icon}
                <span className="text-sm">{suggestion.text}</span>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>

      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask about matches, odds, or betting strategies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}