import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  Star,
  ExternalLink,
  Filter,
  Brain,
  Target,
  Users,
  Building,
  MessageCircle,
  Upload,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CareerRecommendations from '@/components/CareerRecommendations';
import Roadmap from '@/components/Roadmap';
import ChatBot from '@/components/ChatBot';
import ResumeReview from '@/components/ResumeReview';
import RealtimeRecommendations from '@/components/RealtimeRecommendations';

interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  skills: string[];
  description: string;
  postedDate: string;
  platform: 'linkedin' | 'naukri' | 'internshala';
  matchScore: number;
  applicationUrl: string;
  companyLogo?: string;
}

interface MLSuggestion {
  type: 'skill_gap' | 'career_path' | 'salary_insight' | 'trending_role';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userProfile, isLoading: authLoading, isDemoMode, setDemoMode } = useAuth();
  
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOpportunity[]>([]);
  const [mlSuggestions, setMlSuggestions] = useState<MLSuggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Check for demo mode from URL params
  useEffect(() => {
    const demoParam = searchParams.get('demo');
    if (demoParam === 'true') {
      setDemoMode(true);
    }
  }, [searchParams, setDemoMode]);

  const handleSignOut = async () => {
    try {
      if (isDemoMode) {
        setDemoMode(false);
        navigate('/');
      } else {
        await signOut(auth);
        toast.success('Signed out successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  // Mock data - Replace with actual API calls
  const mockJobs: JobOpportunity[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'Bangalore, India',
      salary: '₹15-25 LPA',
      type: 'Full-time',
      experience: '3-5 years',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      description: 'We are looking for a senior software engineer to join our growing team...',
      postedDate: '2 days ago',
      platform: 'linkedin',
      matchScore: 92,
      applicationUrl: 'https://linkedin.com/jobs/123',
      companyLogo: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Mumbai, India',
      salary: '₹8-15 LPA',
      type: 'Full-time',
      experience: '2-4 years',
      skills: ['React', 'JavaScript', 'CSS', 'Redux'],
      description: 'Join our dynamic team as a frontend developer...',
      postedDate: '1 day ago',
      platform: 'naukri',
      matchScore: 88,
      applicationUrl: 'https://naukri.com/job/456'
    },
    {
      id: '3',
      title: 'Data Science Intern',
      company: 'AI Solutions',
      location: 'Delhi, India',
      salary: '₹20,000/month',
      type: 'Internship',
      experience: '0-1 years',
      skills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
      description: 'Exciting internship opportunity in data science...',
      postedDate: '3 days ago',
      platform: 'internshala',
      matchScore: 85,
      applicationUrl: 'https://internshala.com/internship/789'
    },
    {
      id: '4',
      title: 'Full Stack Developer',
      company: 'Digital Agency',
      location: 'Hyderabad, India',
      salary: '₹12-20 LPA',
      type: 'Full-time',
      experience: '2-5 years',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      description: 'Looking for a passionate full stack developer...',
      postedDate: '4 days ago',
      platform: 'linkedin',
      matchScore: 90,
      applicationUrl: 'https://linkedin.com/jobs/321'
    }
  ];

  const mockMLSuggestions: MLSuggestion[] = [
    {
      type: 'skill_gap',
      title: 'Skill Gap Analysis',
      description: 'Based on your profile, learning Docker and Kubernetes could increase your job matches by 35%',
      action: 'Start Learning',
      priority: 'high'
    },
    {
      type: 'career_path',
      title: 'Career Progression',
      description: 'Consider transitioning to Tech Lead roles - 15 relevant positions available',
      action: 'View Roles',
      priority: 'medium'
    },
    {
      type: 'salary_insight',
      title: 'Salary Insights',
      description: 'Your current skill set commands 20% higher salary in Bangalore compared to current location',
      action: 'Explore',
      priority: 'medium'
    },
    {
      type: 'trending_role',
      title: 'Trending Opportunities',
      description: 'AI/ML Engineer roles have increased by 45% this month in your experience range',
      action: 'View Trends',
      priority: 'high'
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setMlSuggestions(mockMLSuggestions);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(job => job.platform === selectedPlatform);
    }

    if (selectedExperience !== 'all') {
      filtered = filtered.filter(job => job.experience.includes(selectedExperience));
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedPlatform, selectedExperience, jobs]);

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'bg-blue-500';
      case 'naukri': return 'bg-purple-500';
      case 'internshala': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return '💼';
      case 'naukri': return '🏢';
      case 'internshala': return '🎓';
      default: return '💼';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'skill_gap': return <Target className="h-5 w-5" />;
      case 'career_path': return <TrendingUp className="h-5 w-5" />;
      case 'salary_insight': return <DollarSign className="h-5 w-5" />;
      case 'trending_role': return <Brain className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg">Loading your personalized dashboard...</p>
            <Progress value={75} className="w-64 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                {isDemoMode ? 'Demo Dashboard' : 'Your Career Dashboard'}
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </h1>
              <p className="text-muted-foreground text-lg">
                {isDemoMode ? 'Exploring Prismiq in demo mode' : 'AI-powered career guidance, recommendations, and job opportunities'}
              </p>
              {userProfile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Welcome back, {userProfile.name}! {userProfile.interests.length} interests tracked
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isDemoMode ? 'Exit Demo' : 'Sign Out'}
            </Button>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Mentor
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Resume
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* ML Suggestions Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">AI Insights & Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mlSuggestions.map((suggestion, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        {getSuggestionIcon(suggestion.type)}
                        <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}>
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                      <Button size="sm" className="w-full">
                        {suggestion.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Job Opportunities</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="naukri">Naukri</SelectItem>
                    <SelectItem value="internshala">Internshala</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="0">Entry Level</SelectItem>
                    <SelectItem value="2">Mid Level</SelectItem>
                    <SelectItem value="5">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Listings */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Available Positions ({filteredJobs.length})
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                Sorted by Match Score
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={job.companyLogo} alt={job.company} />
                          <AvatarFallback>
                            <Building className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="text-base">{job.company}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getPlatformBadgeColor(job.platform)} text-white`}>
                          {getPlatformIcon(job.platform)} {job.platform}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{job.matchScore}% match</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.postedDate}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1" asChild>
                          <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                            Apply Now
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                        <Button variant="outline" size="icon">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </TabsContent>

          {/* Career Recommendations Tab */}
          <TabsContent value="recommendations">
            <CareerRecommendations />
          </TabsContent>

          {/* Skills Roadmap Tab */}
          <TabsContent value="roadmap">
            <Roadmap />
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChatBot />
              </div>
              <div className="lg:col-span-1">
                <RealtimeRecommendations />
              </div>
            </div>
          </TabsContent>

          {/* Resume Upload Tab */}
          <TabsContent value="resume">
            <ResumeReview />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
