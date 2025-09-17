
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Layers, Grid3x3, ListCheck, BookOpen, Star, LayoutDashboard } from "lucide-react";

const Features = () => {
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  
  const features = [
    {
      title: "AI Mentor in 10+ Languages",
      description: "Get personalized career guidance from our multilingual AI mentor, available 24/7.",
      expandedDescription: "Chat with your AI career advisor in your preferred language. Get instant answers about career paths, skill requirements, industry trends, and educational opportunities. Our AI understands cultural nuances and local job markets to provide relevant, actionable advice.",
      icon: (
        <Layers size={24} className="text-primary" />
      )
    },
    {
      title: "Personalized Career Roadmaps",
      description: "AI-generated career paths tailored to your skills, interests, and market opportunities.",
      expandedDescription: "Discover step-by-step career journeys designed specifically for you. Our AI analyzes your current skills, learning preferences, and career goals to create personalized roadmaps with timelines, skill requirements, and milestone tracking.",
      icon: (
        <Grid3x3 size={24} className="text-primary" />
      )
    },
    {
      title: "Real-time Market Insights",
      description: "Stay ahead with live job market data, salary trends, and emerging skill demands.",
      expandedDescription: "Access real-time labor market analytics powered by AI. Track salary ranges, job availability, skill demand trends, and industry growth projections. Make informed career decisions based on current and predicted market conditions.",
      icon: (
        <LayoutDashboard size={24} className="text-primary" />
      )
    },
    {
      title: "Gamified Growth & Projects",
      description: "Build skills through interactive challenges, real projects, and achievement tracking.",
      expandedDescription: "Level up your career through gamified learning experiences. Complete skill challenges, work on real-world projects, earn badges, and track your progress. Connect with mentors and peers while building a portfolio that showcases your abilities.",
      icon: (
        <Star size={24} className="text-primary" />
      )
    }
  ];
  
  const toggleFeature = (index: number) => {
    setOpenFeature(openFeature === index ? null : index);
  };
  
  return (
    <section id="features" className="w-full py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter">
            Your AI-powered career companion
          </h2>
          <p className="text-muted-foreground text-lg">
            Smart tools and personalized guidance to accelerate your career journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Collapsible
              key={index}
              open={openFeature === index}
              onOpenChange={() => toggleFeature(index)}
              className={`prism-glass rounded-xl transition-all duration-300 ${openFeature === index ? 'border-primary/40' : 'border-primary/20'}`}
            >
              <CollapsibleTrigger className="w-full text-left p-6 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                      openFeature === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 pt-2">
                <div className="pt-3 border-t border-border/20">
                  <p className="text-muted-foreground">{feature.expandedDescription}</p>
                  <div className="mt-4 flex justify-end">
                    <button className="text-primary hover:text-primary/80 text-sm font-medium">
                      Learn more →
                    </button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
