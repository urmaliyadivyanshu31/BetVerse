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
  role: 'user' | 'assistant' | 'system';
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

export default function AIBettingAssistant({
  className,
  initialContext,
  sport,
  compact = false,
}: AIBettingAssistantProps) {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await generateChatCompletion(
        messages.map(m => ({ role: m.role, content: m.content })),
        input.trim(),
        initialContext || '',
        sport || 'all'
      );
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI assistant');
      }
      
      const data = await response.json() as AIAssistantResponse;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <Card className={`border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className={`flex flex-col ${compact ? "h-[400px]" : "h-[600px]"}`}>
          <div className="bg-gradient-to-r from-primary/15 to-primary/5 px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src="/ai-assistant-avatar.png" alt="AI Assistant" />
                  <AvatarFallback className="bg-primary/10">AI</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">AI Betting Assistant</h3>
                  <p className="text-xs text-muted-foreground">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">AI-Powered</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "assistant" 
                          ? "bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20" 
                          : "bg-gradient-to-br from-gray-100 to-gray-50"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg shadow-sm transition-all ${
                        message.role === "assistant"
                          ? "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
                          : "bg-gradient-to-br from-primary to-primary/90 text-white"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        formatAIResponse(message.content)
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      )}
                      <p
                        className={`text-[10px] mt-1 ${
                          message.role === "assistant" ? "text-gray-400" : "text-primary-100"
                        }`}
                      >
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            {!compact && (
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTIONS.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 hover:bg-primary/5 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center mr-1.5">
                      {suggestion.icon}
                    </div>
                    {suggestion.text}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex space-x-2">              <Input
                placeholder="Ask about betting strategies, predictions, or analysis..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-full bg-background text-foreground border-border hover:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">
              AI predictions are for informational purposes only. Always bet responsibly.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}