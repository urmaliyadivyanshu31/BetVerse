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
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors",
      color === "bg-green-100 text-green-800" && "bg-green-50 text-green-700 border-green-200",
      color === "bg-yellow-100 text-yellow-800" && "bg-yellow-50 text-yellow-700 border-yellow-200",
      color === "bg-red-100 text-red-800" && "bg-red-50 text-red-700 border-red-200",
      className
    )}>
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
    // Replace section headers with enhanced styled versions
  sections.forEach(section => {
    formattedContent = formattedContent.replace(
      new RegExp(`(${section.label}|${section.regex.source})[:\\s]*`, 'i'),
      `<div class="flex items-center gap-3 font-bold text-primary mt-6 mb-4 bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg border border-primary/10">
        <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span class="text-lg">${section.icon}</span>
        </div>
        <span class="text-base tracking-wide">${section.label}</span>
      </div>`
    );
  });
  // Style risk levels with modern visual indicators
  formattedContent = formattedContent
    .replace(/🟢\s*Low Risk/g, '<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50/80 text-green-700 ring-1 ring-green-200/50 font-medium text-sm shadow-sm hover:bg-green-50 transition-colors"><span class="h-2 w-2 rounded-full bg-green-500"></span>Low Risk</div>')
    .replace(/🟡\s*Medium Risk/g, '<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50/80 text-yellow-700 ring-1 ring-yellow-200/50 font-medium text-sm shadow-sm hover:bg-yellow-50 transition-colors"><span class="h-2 w-2 rounded-full bg-yellow-500"></span>Medium Risk</div>')
    .replace(/🔴\s*High Risk/g, '<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50/80 text-red-700 ring-1 ring-red-200/50 font-medium text-sm shadow-sm hover:bg-red-50 transition-colors"><span class="h-2 w-2 rounded-full bg-red-500"></span>High Risk</div>');
    // Style odds and statistics with modern indicators
  formattedContent = formattedContent
    .replace(/(\d+(?:\.\d+)?%)/g, '<span class="inline-flex items-center gap-1"><TrendingUp className="h-4 w-4 text-primary" /><span class="text-primary font-bold">$1</span></span>')
    .replace(/(\d+\.\d+)(?:\s*odds)/g, '<span class="inline-block font-mono text-primary font-bold bg-primary/5 px-3 py-1 rounded-md shadow-sm hover:bg-primary/10 transition-colors">$1</span>');
  
  // Style key match details with improved hierarchy
  formattedContent = formattedContent.replace(
    /(Head-to-head|Recent Form|Key Stats|Team News):/g,
    '<span class="font-bold text-primary block mt-3 mb-2 text-sm uppercase tracking-wide">$1:</span>'
  );
  
  // Convert line breaks and lists
  formattedContent = formattedContent
    .replace(/\n\s*•/g, '<br>• ')
    .replace(/\n/g, '<br>');
  
  return (
    <div className="prose prose-sm max-w-none [&_.risk-badge]:inline-flex [&_.risk-badge]:items-center [&_.risk-badge]:px-2 [&_.risk-badge]:py-1 [&_.risk-badge]:rounded-full [&_.risk-badge]:text-sm [&_.risk-badge.low]:bg-green-100 [&_.risk-badge.low]:text-green-800 [&_.risk-badge.medium]:bg-yellow-100 [&_.risk-badge.medium]:text-yellow-800 [&_.risk-badge.high]:bg-red-100 [&_.risk-badge.high]:text-red-800 [&_ul]:mt-4 [&_ul]:space-y-2 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:before:content-['•'] [&_li]:before:text-primary [&_li]:before:mr-2">
      <div className="[&_a]:text-primary [&_strong]:text-primary [&_strong]:font-semibold [&_ul]:space-y-1 [&_li]:ml-4" dangerouslySetInnerHTML={{ __html: formattedContent }} />
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
        >          {message.role === 'user' ? (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          ) : (
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src="/ai-assistant-avatar.png" alt="AI" />
              <AvatarFallback className="bg-primary/5">
                <Sparkles className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div
          className={cn(
            "rounded-xl p-4 max-w-[80%] shadow-sm",
            message.role === 'user'
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'bg-card border border-border/50'
          )}
        >
          <div className={cn(
            "prose prose-sm",
            message.role === 'user' ? 'prose-invert' : ''
          )}>
            {message.role === 'assistant' 
              ? formatAIResponse(message.content)
              : <p>{message.content}</p>
            }
          </div>
        </div>
      </div>
    );
  };

  return (    <Card className={cn("flex flex-col shadow-lg", compact ? "h-[600px]" : "h-full", className)}>
      <CardHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src="/ai-assistant-avatar.png" />
              <AvatarFallback className="bg-primary/5">
                <Sparkles className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-bold">AI Betting Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">Analyzing matches & odds in real-time</p>
            </div>
          </div>
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="hover:bg-primary/5"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          )}
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6 mb-4">
          {messages.map((message, index) => renderMessage(message, index))}
          {isLoading && (
            <div className="flex items-center gap-3 text-muted-foreground bg-primary/5 p-3 rounded-lg animate-pulse">
              <Bot className="h-5 w-5 text-primary" />
              <span>Analyzing match data and generating insights...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-3 mt-6">
            {SUGGESTIONS.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center justify-start gap-3 h-auto p-4 text-left hover:bg-primary/5 hover:border-primary/20 transition-colors"
                onClick={() => handleSuggestedQuestion(suggestion.text)}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {suggestion.icon}
                </div>
                <span className="font-medium">{suggestion.text}</span>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>

      <CardFooter className="p-6 border-t bg-card">
        <form onSubmit={handleSubmit} className="flex w-full gap-3">
          <Input
            placeholder="Ask about match analysis, predictions, or betting strategies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 h-11 px-4 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"
          />
          <Button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-11 px-6 bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Send
              </>
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}