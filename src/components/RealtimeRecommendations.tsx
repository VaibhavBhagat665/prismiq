import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, TrendingUp, Target, BookOpen, Users, RefreshCw } from 'lucide-react';
import { GeminiService } from '@/lib/gemini';
import { useAuth } from '@/contexts/AuthContext';

interface Recommendation {
  id: string;
  type: 'skill' | 'career' | 'learning' | 'networking' | 'project';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  estimatedTime?: string;
}

const RealtimeRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useAuth();

  const generateRecommendations = async () => {
    if (!userProfile) return;

    setIsLoading(true);
    try {
      const geminiRecs = await GeminiService.generateRecommendations(userProfile);
      
      // Transform Gemini recommendations into structured format
      const structuredRecs: Recommendation[] = geminiRecs.map((rec, index) => ({
        id: `rec-${Date.now()}-${index}`,
        type: getRecommendationType(rec),
        title: extractTitle(rec),
        description: rec,
        priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
        actionable: true,
        estimatedTime: getEstimatedTime(rec)
      }));

      setRecommendations(structuredRecs);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      // Fallback recommendations
      setRecommendations(getFallbackRecommendations());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [userProfile]);

  const getRecommendationType = (rec: string): Recommendation['type'] => {
    const lower = rec.toLowerCase();
    if (lower.includes('skill') || lower.includes('learn') || lower.includes('technology')) return 'skill';
    if (lower.includes('career') || lower.includes('job') || lower.includes('role')) return 'career';
    if (lower.includes('course') || lower.includes('certification') || lower.includes('study')) return 'learning';
    if (lower.includes('network') || lower.includes('connect') || lower.includes('community')) return 'networking';
    if (lower.includes('project') || lower.includes('portfolio') || lower.includes('build')) return 'project';
    return 'skill';
  };

  const extractTitle = (rec: string): string => {
    const sentences = rec.split('.');
    return sentences[0].length > 50 ? sentences[0].substring(0, 50) + '...' : sentences[0];
  };

  const getEstimatedTime = (rec: string): string => {
    const lower = rec.toLowerCase();
    if (lower.includes('course') || lower.includes('certification')) return '2-4 weeks';
    if (lower.includes('project') || lower.includes('portfolio')) return '1-2 weeks';
    if (lower.includes('network') || lower.includes('connect')) return '1-3 days';
    return '1 week';
  };

  const getFallbackRecommendations = (): Recommendation[] => [
    {
      id: 'fallback-1',
      type: 'skill',
      title: 'Learn TypeScript for Better Career Prospects',
      description: 'TypeScript is in high demand and can increase your salary potential by 15-20%',
      priority: 'high',
      actionable: true,
      estimatedTime: '2-3 weeks'
    },
    {
      id: 'fallback-2',
      type: 'project',
      title: 'Build a Portfolio Project',
      description: 'Create a full-stack application showcasing your skills to potential employers',
      priority: 'high',
      actionable: true,
      estimatedTime: '2-4 weeks'
    },
    {
      id: 'fallback-3',
      type: 'networking',
      title: 'Connect with Industry Professionals',
      description: 'Join tech communities and connect with professionals in your target field',
      priority: 'medium',
      actionable: true,
      estimatedTime: '1 week'
    }
  ];

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'skill': return <Target className="h-4 w-4" />;
      case 'career': return <TrendingUp className="h-4 w-4" />;
      case 'learning': return <BookOpen className="h-4 w-4" />;
      case 'networking': return <Users className="h-4 w-4" />;
      case 'project': return <Sparkles className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'skill': return 'text-blue-500 bg-blue-500/10';
      case 'career': return 'text-green-500 bg-green-500/10';
      case 'learning': return 'text-purple-500 bg-purple-500/10';
      case 'networking': return 'text-orange-500 bg-orange-500/10';
      case 'project': return 'text-pink-500 bg-pink-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-500/5';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/5';
      case 'low': return 'border-green-500/50 bg-green-500/5';
    }
  };

  return (
    <Card className="prism-glass border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommendations
            <Badge variant="outline" className="ml-2">Real-time</Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRecommendations}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-card/30 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-sm ${getPriorityColor(rec.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${getTypeColor(rec.type)}`}>
                  {getTypeIcon(rec.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          rec.priority === 'high' ? 'text-red-500 border-red-500/50' :
                          rec.priority === 'medium' ? 'text-yellow-500 border-yellow-500/50' :
                          'text-green-500 border-green-500/50'
                        }`}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {rec.type}
                      </Badge>
                      {rec.estimatedTime && (
                        <span className="text-xs text-muted-foreground">
                          Est. {rec.estimatedTime}
                        </span>
                      )}
                    </div>
                    
                    {rec.actionable && (
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {recommendations.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Avatar className="h-12 w-12 mx-auto mb-3">
              <AvatarFallback className="bg-primary/20 text-primary">
                <Sparkles className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground">
              Complete your profile to get personalized recommendations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeRecommendations;
