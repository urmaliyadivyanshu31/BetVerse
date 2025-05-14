'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import type { JSX } from 'react';
import { AIAssistantResponse } from '@/app/api/ai-assistant/route';

// Types for our component state
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistantPage() {
  // State for handling messages, input, and loading state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to scroll to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Function to format the AI response with styled sections
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
    
    // Style risk levels
    formattedContent = formattedContent
      .replace(/🟢\s*Low Risk/g, '<span class="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">🟢 Low Risk</span>')
      .replace(/🟡\s*Medium Risk/g, '<span class="inline-flex items-center px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">🟡 Medium Risk</span>')
      .replace(/🔴\s*High Risk/g, '<span class="inline-flex items-center px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">🔴 High Risk</span>');
    
    // Style odds and percentages
    formattedContent = formattedContent.replace(
      /(\d+\.\d+)(?=\s*odds|\s*%|\))/g, 
      '<span class="font-mono text-primary">$1</span>'
    );
    
    // Convert line breaks to <br> tags while preserving lists
    formattedContent = formattedContent
      .replace(/\n\s*•/g, '<br>•')
      .replace(/\n/g, '<br>');
    
    return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formattedContent }} />;
  };

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
    setError(null);
    
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
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render each message
  const renderMessage = (message: Message, index: number) => {
    return (
      <div
        key={index}
        className={`p-4 rounded-lg mb-4 ${
          message.role === 'user'
            ? 'bg-blue-100 ml-auto max-w-[80%]'
            : 'bg-gray-100 mr-auto max-w-[80%]'
        }`}
      >
        <div className="font-semibold mb-1">
          {message.role === 'user' ? 'You' : 'Betting Assistant'}
        </div>
        {message.role === 'assistant' ? (
          formatAIResponse(message.content)
        ) : (
          <div>{message.content}</div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Betverse AI Sports Betting Assistant
      </h1>
      
      {/* Welcome message when no messages exist */}
      {messages.length === 0 && (
        <div className="bg-emerald-50 p-6 rounded-lg mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Welcome to Your Sports Betting Assistant!</h2>
          <p className="mb-4">
            Ask me about upcoming matches, team analysis, or betting recommendations.
          </p>
          <div className="text-sm text-gray-600">
            Try questions like:
            <ul className="mt-2">
              <li>"What bet should I place on today's IPL match?"</li>
              <li>"Give me an analysis of Manchester United vs Chelsea."</li>
              <li>"What are good bets for the NBA playoffs tonight?"</li>
            </ul>
          </div>
        </div>
      )}

      {/* Messages section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => renderMessage(message, index))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-pulse">Thinking</div>
              <div className="flex">
                <span className="animate-bounce delay-75">.</span>
                <span className="animate-bounce delay-150">.</span>
                <span className="animate-bounce delay-300">.</span>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="text-red-500 p-2 rounded bg-red-50">
              Error: {error}
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a match, team analysis, or betting recommendation..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
      
      {/* Disclaimer at bottom */}
      <div className="text-xs text-gray-500 mt-4 text-center">
        Disclaimer: Betting involves risk. Always gamble responsibly and be aware that
        predictions are not guarantees of outcomes.
      </div>
    </div>
  );
}