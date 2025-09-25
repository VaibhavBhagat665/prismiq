import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const skillsData = [
    { name: 'React Development', progress: 78, level: 'Intermediate', trending: true },
    { name: 'UI/UX Design', progress: 65, level: 'Beginner+', trending: false },
    { name: 'Data Analysis', progress: 45, level: 'Beginner', trending: true },
    { name: 'Python Programming', progress: 52, level: 'Beginner+', trending: true }
  ];

  const careerPaths = [
    { 
      title: 'Frontend Developer', 
      match: '92%', 
      demand: 'High', 
      salary: '$65k-95k',
      nextStep: 'Complete JavaScript fundamentals'
    },
    { 
      title: 'Product Designer', 
      match: '78%', 
      demand: 'Medium', 
      salary: '$55k-85k',
      nextStep: 'Build portfolio with 3 projects'
    },
    { 
      title: 'Data Analyst', 
      match: '65%', 
      demand: 'Very High', 
      salary: '$70k-100k',
      nextStep: 'Learn SQL and Tableau'
    }
  ];

  const recentAchievements = [
    { title: 'Completed React Hooks Course', points: 150, date: '2 days ago' },
    { title: 'Portfolio Project Approved', points: 200, date: '1 week ago' },
    { title: 'JavaScript Quiz - 95%', points: 100, date: '1 week ago' }
  ];

  const aiRecommendations = [
    {
      type: 'Skill Gap',
      message: 'Focus on TypeScript to boost your frontend developer score by 15%',
      action: 'Start TypeScript Course'
    },
    {
      type: 'Market Trend',
      message: 'AI/ML skills show 40% salary increase in your region',
      action: 'Explore AI Fundamentals'
    },
    {
      type: 'Network',
      message: '3 alumni from your university work at companies you\'re interested in',
      action: 'Connect on LinkedIn'
    }
  ];

  return (
    <section className="w-full py-20 px-6 md:px-12 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cosmic-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Your Personalized Career Dashboard
          </h2>
          <p className="text-muted-foreground text-lg">
            Track your progress, discover opportunities, and get AI-powered guidance
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="prism-glass rounded-lg p-1 inline-flex">
            {['overview', 'skills', 'careers', 'ai-mentor'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Progress Overview */}
                <Card className="prism-glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                      Weekly Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-card/50">
                        <div className="text-2xl font-bold text-primary">12h</div>
                        <div className="text-sm text-muted-foreground">Learning Time</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-card/50">
                        <div className="text-2xl font-bold text-secondary">450</div>
                        <div className="text-sm text-muted-foreground">XP Earned</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-card/50">
                        <div className="text-2xl font-bold text-accent">3</div>
                        <div className="text-sm text-muted-foreground">Projects Done</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card className="prism-glass border-border/50">
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentAchievements.map((achievement, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary text-sm font-bold">🎯</span>
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{achievement.title}</div>
                              <div className="text-sm text-muted-foreground">{achievement.date}</div>
                            </div>
                          </div>
                          <Badge variant="secondary">+{achievement.points} XP</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'skills' && (
              <Card className="prism-glass border-border/50">
                <CardHeader>
                  <CardTitle>Skill Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {skillsData.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{skill.name}</span>
                            {skill.trending && <Badge variant="outline" className="text-xs">🔥 Trending</Badge>}
                          </div>
                          <Badge variant="secondary">{skill.level}</Badge>
                        </div>
                        <Progress value={skill.progress} className="h-2" />
                        <div className="text-sm text-muted-foreground">{skill.progress}% complete</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'careers' && (
              <div className="space-y-4">
                {careerPaths.map((path, index) => (
                  <Card key={index} className="prism-glass border-border/50 hover:border-primary/40 transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{path.title}</h3>
                          <p className="text-sm text-muted-foreground">Next: {path.nextStep}</p>
                        </div>
                        <Badge variant="outline" className="text-primary border-primary/50">
                          {path.match} match
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Market Demand:</span>
                          <span className="ml-2 font-medium text-foreground">{path.demand}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Salary Range:</span>
                          <span className="ml-2 font-medium text-foreground">{path.salary}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'ai-mentor' && (
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <Card key={index} className="prism-glass border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{rec.type}</Badge>
                          </div>
                          <p className="text-foreground mb-3">{rec.message}</p>
                          <Button size="sm" variant="outline">
                            {rec.action}
                          </Button>
                        </div>
                        <Avatar className="ml-4">
                          <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Stats */}
            <Card className="prism-glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Your Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-bold text-xl">7</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Career Explorer</div>
                    <div className="text-sm text-muted-foreground">2,150 / 2,500 XP to next level</div>
                  </div>
                  <Progress value={86} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="prism-glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Market Pulse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Frontend Dev</span>
                  <Badge variant="outline" className="text-green-500 border-green-500/50">📈 +15%</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI/ML Engineer</span>
                  <Badge variant="outline" className="text-green-500 border-green-500/50">📈 +28%</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">UX Designer</span>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">➡️ Stable</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Next Goals */}
            <Card className="prism-glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">This Week's Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm text-muted-foreground">Complete React Testing module</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" checked readOnly />
                  <span className="text-sm text-muted-foreground line-through">Update portfolio with new project</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" readOnly />
                  <span className="text-sm text-muted-foreground">Network with 2 professionals</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;