'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Zap, RefreshCw, AlertTriangle, Brain, TrendingUp, Sparkles, BarChart2, Percent, Clock, DollarSign, ChevronRight } from "lucide-react";

interface SportCategory {
  name: string;
  active: boolean;
}

interface Recommendation {
  id: string;
  type: "high" | "medium" | "low";
  title: string;
  match: string;
  prediction: string;
  odds: number;
  confidence: number;
  potentialReturn: number;
  time: string;
}

const defaultRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "high",
    title: "Match Winner",
    match: "Liverpool vs Manchester United",
    prediction: "Liverpool to Win",
    odds: 1.85,
    confidence: 85,
    potentialReturn: 185,
    time: "Today, 20:00"
  },
  {
    id: "2",
    type: "medium",
    title: "Over/Under",
    match: "Arsenal vs Chelsea",
    prediction: "Over 2.5 Goals",
    odds: 1.95,
    confidence: 75,
    potentialReturn: 195,
    time: "Tomorrow, 15:30"
  },
  {
    id: "3",
    type: "low",
    title: "Both Teams to Score",
    match: "Barcelona vs Real Madrid",
    prediction: "Yes",
    odds: 1.75,
    confidence: 65,
    potentialReturn: 175,
    time: "Tomorrow, 21:00"
  }
];

export default function AIRecommendations({ className }: { className?: string }) {
  const [categories, setCategories] = useState<SportCategory[]>([
    { name: 'Football', active: true },
    { name: 'Cricket', active: false },
    { name: 'Tennis', active: false },
    { name: 'Basketball', active: false },
    { name: 'Horse Racing', active: false },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(defaultRecommendations);

  // Function to get recommendations based on selected categories
  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const activeCategories = categories.filter(c => c.active).map(c => c.name);
      
      if (activeCategories.length === 0) {
        setError('Please select at least one sport category');
        setLoading(false);
        return;
      }
      
      // Create a prompt for the AI
      const prompt = `Generate 3 betting recommendations for upcoming matches in the following sports: ${activeCategories.join(', ')}. 
      For each recommendation, provide the match name, league/tournament, specific bet recommendation, risk level (Low, Medium, or High), 
      approximate odds, and a confidence percentage.`;
      
      // Call the OpenAI API
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Process the AI's response to extract structured recommendations
      // This is a simplified approach - in a real app, you might want to use a more structured approach
      const aiResponse = data.content;
      
      // Example parsing logic - this is simplified and might need enhancement
      const recommendationRegex = /(\d+)\.\s+(.*?)\s+\((.*?)\):\s+(.*?)\s+Risk Level:\s+(Low|Medium|High)[\s,]+Odds:\s+([\d\.]+|[\d\.]+-[\d\.]+)[\s,]+Confidence:\s+(\d+)%/gi;
      
      const extractedRecommendations: Recommendation[] = [];
      let match;
      
      while ((match = recommendationRegex.exec(aiResponse)) !== null) {
        extractedRecommendations.push({
          id: match[1],
          type: match[5].toLowerCase() as "low" | "medium" | "high",
          title: match[4],
          match: match[2],
          prediction: match[4],
          odds: parseFloat(match[6]),
          confidence: parseInt(match[7], 10),
          potentialReturn: parseFloat(match[6]) * 100,
          time: "Today, 20:00"
        });
      }
      
      // If we couldn't parse the recommendations, generate some manually
      if (extractedRecommendations.length === 0) {
        // Generate some default recommendations based on the selected sports
        const defaultRecommendations: Recommendation[] = generateDefaultRecommendations(activeCategories);
        setRecommendations(defaultRecommendations);
      } else {
        setRecommendations(extractedRecommendations);
      }
      
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to generate default recommendations if parsing fails
  const generateDefaultRecommendations = (sports: string[]): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    if (sports.includes('Football')) {
      recommendations.push({
        id: "1",
        type: "medium",
        title: "Match Winner",
        match: 'Manchester United vs Chelsea',
        prediction: 'Under 2.5 Goals',
        odds: 1.95,
        confidence: 73,
        potentialReturn: 195,
        time: "Today, 20:00"
      });
    }
    
    if (sports.includes('Cricket')) {
      recommendations.push({
        id: "2",
        type: "low",
        title: "Over/Under",
        match: 'Mumbai Indians vs Chennai Super Kings',
        prediction: 'Over 165.5 Total Runs',
        odds: 1.88,
        confidence: 82,
        potentialReturn: 188,
        time: "Tomorrow, 15:30"
      });
    }
    
    if (sports.includes('Tennis')) {
      recommendations.push({
        id: "3",
        type: "low",
        title: "Match Winner",
        match: 'Djokovic vs Nadal',
        prediction: 'Nadal to Win',
        odds: 1.75,
        confidence: 85,
        potentialReturn: 175,
        time: "Tomorrow, 21:00"
      });
    }
    
    if (sports.includes('Basketball')) {
      recommendations.push({
        id: "4",
        type: "medium",
        title: "Spread",
        match: 'Lakers vs Warriors',
        prediction: 'Warriors -4.5',
        odds: 1.90,
        confidence: 68,
        potentialReturn: 190,
        time: "Today, 20:00"
      });
    }
    
    if (sports.includes('Horse Racing')) {
      recommendations.push({
        id: "5",
        type: "high",
        title: "Match Winner",
        match: 'Royal Ascot - Gold Cup',
        prediction: 'Back Stradivarius',
        odds: 3.50,
        confidence: 60,
        potentialReturn: 350,
        time: "Tomorrow, 15:30"
      });
    }
    
    // If no specific sport matches or we need more recommendations
    while (recommendations.length < 3) {
      recommendations.push({
        id: "6",
        type: "medium",
        title: "Match Winner",
        match: 'Popular Match of the Day',
        prediction: 'Back Favorite Team',
        odds: 2.00,
        confidence: 70,
        potentialReturn: 200,
        time: "Today, 20:00"
      });
    }
    
    return recommendations.slice(0, 3); // Return max 3 recommendations
  };

  // Toggle a category's active state
  const toggleCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories[index].active = !newCategories[index].active;
    setCategories(newCategories);
  };

  // Get recommendations on initial load
  useEffect(() => {
    getRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to render risk level with appropriate styling
  const renderRiskLevel = (risk: 'Low' | 'Medium' | 'High') => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[risk]}`}>
        {risk} Risk
      </span>
    );
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/15 to-primary/5 border-b border-border py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
              <CardDescription className="text-xs">Smart betting suggestions</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Top Picks</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="border-b p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-bold">AI Recommendations</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={getRecommendations}
            disabled={loading}
            className="h-8 text-xs"
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Select Sports</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => toggleCategory(index)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full border transition-colors",
                    category.active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-muted"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-start mb-4">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-primary animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Generating AI recommendations...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="group p-4 rounded-lg bg-gradient-to-br from-black to-white-50 border border-gray-200 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getRecommendationStyle(rec.type)}`}>
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium">{rec.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceBadgeStyle(rec.type)}`}>
                            {getConfidenceLabel(rec.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{rec.match}</p>
                        <div className="mt-2 flex flex-wrap gap-3">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{rec.time}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <BarChart2 className="h-3.5 w-3.5 mr-1" />
                            <span>{rec.prediction}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Percent className="h-3.5 w-3.5 mr-1" />
                            <span>Odds: {rec.odds}</span>
                          </div>
                          <div className="flex items-center text-xs text-green-600">
                            <DollarSign className="h-3.5 w-3.5 mr-1" />
                            <span>Potential Return: ${rec.potentialReturn}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {recommendations.length === 0 && !loading && !error && (
                <div className="text-center py-8 text-muted-foreground">
                  No recommendations available. Try selecting different sports.
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            <p>Recommendations are based on AI analysis of historical data and current form. 
            Always bet responsibly and consider multiple factors before placing a bet.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getRecommendationStyle(type: "high" | "medium" | "low") {
  switch (type) {
    case "high":
      return "bg-gradient-to-br from-green-100 to-green-50 text-green-600";
    case "medium":
      return "bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600";
    case "low":
      return "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600";
  }
}

function getConfidenceBadgeStyle(type: "high" | "medium" | "low") {
  switch (type) {
    case "high":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-orange-100 text-orange-700";
  }
}

function getConfidenceLabel(type: "high" | "medium" | "low") {
  switch (type) {
    case "high":
      return "High Confidence";
    case "medium":
      return "Medium Confidence";
    case "low":
      return "Low Confidence";
  }
}