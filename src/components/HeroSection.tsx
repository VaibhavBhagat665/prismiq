import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TaskBoard from './TaskBoard';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const HeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  return <section className="relative w-full py-12 md:py-20 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Cosmic particle effect (background dots) */}
      <div className="absolute inset-0 cosmic-grid opacity-30"></div>
      
      {/* Gradient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full">
        <div className="w-full h-full opacity-10 bg-primary blur-[120px]"></div>
      </div>
      
      <div className={`relative z-10 max-w-4xl text-center space-y-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse-slow"></span>
            AI Career Insights Now Live
            <Loader className="h-3 w-3 animate-spin text-primary" />
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-balance text-foreground">
          Prismiq — Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Future, Decoded</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          AI-powered personalized career advisor. Discover your skills. Map your future. Evolve with the job market.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 items-center">
          <Button 
            onClick={() => navigate('/auth/signup')}
            className="hero-gradient text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-base h-12 px-8 transition-all duration-300 min-h-[48px] font-medium"
          >
            Get Started Free
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth/signin')}
            className="border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary/60 text-base h-12 px-8 transition-all duration-300 min-h-[48px]"
          >
            Sign In
          </Button>
        </div>

        <div className="pt-4 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard?demo=true')}
            className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
          >
            Try Demo Mode
          </Button>
        </div>

        <div className="pt-2 text-sm text-muted-foreground">
          Free forever • AI mentorship in 10+ languages
        </div>
      </div>

      {/* Task Manager UI integrated in hero section with glassmorphic effect */}
      <div className={`w-full max-w-7xl mt-12 z-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <div className="cosmic-glow relative rounded-xl overflow-hidden border border-border backdrop-blur-sm bg-card shadow-lg">
          {/* Dashboard Header */}
          <div className="bg-card backdrop-blur-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <div className="h-3 w-3 rounded-sm bg-foreground"></div>
                </div>
                <span className="text-foreground font-medium">Career Development Dashboard</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-muted border-2 border-card"></div>
                  <div className="h-8 w-8 rounded-full bg-muted/80 border-2 border-card"></div>
                  <div className="h-8 w-8 rounded-full bg-muted/60 border-2 border-card"></div>
                  <div className="h-8 w-8 rounded-full bg-muted/40 border-2 border-card flex items-center justify-center text-xs text-foreground">+3</div>
                </div>
                
                <div className="h-8 px-3 rounded-md bg-muted flex items-center justify-center text-foreground text-sm">
                  Share
                </div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="flex h-[600px] overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 border-r border-border p-4 space-y-4 hidden md:block bg-card">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase">Navigation</div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary">
                       <div className="h-3 w-3 rounded-sm bg-primary"></div>
                       <span>Career Map</span>
                     </div>
                     <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                       <div className="h-3 w-3 rounded-sm bg-muted-foreground/30"></div>
                       <span>Skills</span>
                     </div>
                     <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                       <div className="h-3 w-3 rounded-sm bg-muted-foreground/30"></div>
                       <span>Market Trends</span>
                     </div>
                     <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                       <div className="h-3 w-3 rounded-sm bg-muted-foreground/30"></div>
                       <span>AI Insights</span>
                     </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <div className="text-xs text-muted-foreground uppercase">Departments</div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                       <div className="h-3 w-3 rounded-full bg-secondary/60"></div>
                       <span>Technology</span>
                     </div>
                     <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                       <div className="h-3 w-3 rounded-full bg-secondary/50"></div>
                       <span>Healthcare</span>
                     </div>
                     <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                       <div className="h-3 w-3 rounded-full bg-secondary/40"></div>
                       <span>Creative</span>
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-4 bg-background overflow-hidden">
                {/* Board Header */}
                <div className="flex items-center justify-between mb-6 min-w-0">
                   <div className="flex items-center gap-2 flex-shrink-0">
                     <h3 className="font-medium text-foreground">Career Goals</h3>
                     <span className="text-xs bg-primary/10 px-2 py-1 rounded-full text-primary">8</span>
                   </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 9L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 9L17 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 17L7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                     <div className="h-8 px-3 rounded-md hero-gradient text-white flex items-center justify-center text-sm font-medium whitespace-nowrap">
                       Add Goal
                     </div>
                  </div>
                </div>
                
                {/* Kanban Board */}
                <div className="overflow-hidden">
                  <TaskBoard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;