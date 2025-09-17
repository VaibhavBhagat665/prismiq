
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const Pricing = () => {
  const plans = [
    {
      name: "Explorer",
      price: "Free",
      description: "Perfect for students just starting to explore career options",
      features: [
        "Basic AI career chat",
        "5 career assessments/month",
        "Standard career roadmaps",
        "Community access",
        "Basic skill tracking"
      ],
      buttonText: "Start Free",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Accelerator",
      price: "$19",
      period: "per month",
      description: "Ideal for students serious about career development",
      features: [
        "Advanced AI mentor",
        "Unlimited assessments",
        "Personalized roadmaps",
        "Real-time market insights",
        "Gamified projects",
        "1-on-1 mentor sessions",
        "Priority support"
      ],
      buttonText: "Start 14-day trial",
      buttonVariant: "default",
      popular: true
    },
    {
      name: "Professional",
      price: "$49",
      period: "per month",
      description: "For young professionals and advanced students",
      features: [
        "Everything in Accelerator",
        "Industry-specific insights",
        "Advanced project portfolio",
        "Networking opportunities",
        "Job placement assistance",
        "Expert career coaching",
        "24/7 premium support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      popular: false
    }
  ];
  
  return (
    <section id="pricing" className="w-full py-20 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Plans that grow with your ambitions
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the perfect plan for your career journey, from exploration to acceleration
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl border flex flex-col h-full transition-all duration-300 relative ${
                plan.popular 
                  ? "prism-glass border-primary/50" 
                  : "bg-card border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm rounded-full font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="mb-auto">
                <h3 className="text-2xl font-medium tracking-tighter mb-1 text-foreground">{plan.name}</h3>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold tracking-tighter text-foreground">{plan.price}</div>
                  {plan.period && <div className="text-sm text-muted-foreground">{plan.period}</div>}
                </div>
                
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  className={
                    plan.buttonVariant === "default" 
                      ? "w-full hero-gradient text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
                      : "w-full border-primary/40 text-foreground hover:bg-primary/10"
                  }
                  variant={plan.buttonVariant as "default" | "outline"}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center text-muted-foreground">
          Have questions? <a href="#" className="text-primary hover:underline">Contact our student success team</a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
