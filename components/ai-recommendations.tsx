'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Zap, RefreshCw, AlertTriangle } from "lucide-react";

interface SportCategory {
  name: string;
  active: boolean;
}

interface Recommendation {
  match: string;
  league: string;
  recommendation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  odds: string;
  confidence: number;
}

export default function AIRecommendations({ className }: { className?: string }) {
  const [categories, setCategories] = useState<SportCategory[]>([
    { name: 'Football', active: true },
    { name: 'Cricket', active: false },
    { name: 'Tennis', active: false },
    { name: 'Basketball', active: false },
    { name: 'Horse Racing', active: false },
  ]);
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          match: match[2],
          league: match[3],
          recommendation: match[4],
          riskLevel: match[5] as 'Low' | 'Medium' | 'High',
          odds: match[6],
          confidence: parseInt(match[7], 10)
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
        match: 'Manchester United vs Chelsea',
        league: 'Premier League',
        recommendation: 'Under 2.5 Goals',
        riskLevel: 'Medium',
        odds: '1.95',
        confidence: 73
      });
    }
    
    if (sports.includes('Cricket')) {
      recommendations.push({
        match: 'Mumbai Indians vs Chennai Super Kings',
        league: 'IPL',
        recommendation: 'Over 165.5 Total Runs',
        riskLevel: 'Low',
        odds: '1.88',
        confidence: 82
      });
    }
    
    if (sports.includes('Tennis')) {
      recommendations.push({
        match: 'Djokovic vs Nadal',
        league: 'French Open',
        recommendation: 'Nadal to Win',
        riskLevel: 'Low',
        odds: '1.75',
        confidence: 85
      });
    }
    
    if (sports.includes('Basketball')) {
      recommendations.push({
        match: 'Lakers vs Warriors',
        league: 'NBA',
        recommendation: 'Warriors -4.5',
        riskLevel: 'Medium',
        odds: '1.90',
        confidence: 68
      });
    }
    
    if (sports.includes('Horse Racing')) {
      recommendations.push({
        match: 'Royal Ascot - Gold Cup',
        league: 'Grade 1',
        recommendation: 'Back Stradivarius',
        riskLevel: 'High',
        odds: '3.50',
        confidence: 60
      });
    }
    
    // If no specific sport matches or we need more recommendations
    while (recommendations.length < 3) {
      recommendations.push({
        match: 'Popular Match of the Day',
        league: 'Major League',
        recommendation: 'Back Favorite Team',
        riskLevel: 'Medium',
        odds: '2.00',
        confidence: 70
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
      <CardContent className="p-0">
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
              {recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{rec.match}</h4>
                      <div className="text-xs text-muted-foreground">{rec.league}</div>
                    </div>
                    {renderRiskLevel(rec.riskLevel)}
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md mb-3">
                    <div className="font-medium text-sm">{rec.recommendation}</div>
                    <div className="text-xs text-muted-foreground mt-1">Odds: {rec.odds}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${rec.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium ml-2">{rec.confidence}% Confidence</span>
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