import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  CheckCircle, 
  Circle, 
  BookOpen, 
  Code, 
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RoadmapPhase {
  phase: string;
  skills: string[];
  courses: string[];
  projects: string[];
}

interface RoadmapData {
  roadmap: RoadmapPhase[];
}

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCareer, setSelectedCareer] = useState('Data Scientist');
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());

  const careerOptions = [
    'Data Scientist',
    'ML Engineer', 
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer'
  ];

  // Listen to Firestore for real-time updates
  useEffect(() => {
    const q = query(
      collection(db, 'users', 'demo-user', 'roadmaps'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as RoadmapData;
        setRoadmap(data.roadmap || []);
      }
    }, (error) => {
      console.error('Error listening to roadmap:', error);
    });

    return () => unsubscribe();
  }, []);

  const fetchRoadmap = async (career: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/roadmap?career=${encodeURIComponent(career)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch roadmap');
      }

      const data = await response.json();
      setRoadmap(data.roadmap || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(selectedCareer);
  }, [selectedCareer]);

  const togglePhaseCompletion = (phaseIndex: number) => {
    const newCompleted = new Set(completedPhases);
    if (newCompleted.has(phaseIndex)) {
      newCompleted.delete(phaseIndex);
    } else {
      newCompleted.add(phaseIndex);
    }
    setCompletedPhases(newCompleted);
  };

  const getProgressPercentage = () => {
    if (roadmap.length === 0) return 0;
    return (completedPhases.size / roadmap.length) * 100;
  };

  const getPhaseIcon = (index: number) => {
    if (completedPhases.has(index)) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    return <Circle className="h-6 w-6 text-gray-400" />;
  };

  const getEstimatedTime = (phaseIndex: number) => {
    const times = ['2-3 months', '3-4 months', '4-6 months'];
    return times[phaseIndex] || '2-3 months';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Skills Roadmap</h2>
        </div>
        <Select value={selectedCareer} onValueChange={setSelectedCareer}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Career" />
          </SelectTrigger>
          <SelectContent>
            {careerOptions.map((career) => (
              <SelectItem key={career} value={career}>
                {career}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Progress
          </CardTitle>
          <CardDescription>
            Track your progress through the {selectedCareer} roadmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completedPhases.size} of {roadmap.length} phases completed</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {Math.round(getProgressPercentage())}% complete
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {roadmap.map((phase, index) => (
            <Card 
              key={index} 
              className={`transition-all duration-200 ${
                completedPhases.has(index) 
                  ? 'bg-green-50 border-green-200' 
                  : 'hover:shadow-md'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePhaseCompletion(index)}
                      className="transition-colors hover:scale-110"
                    >
                      {getPhaseIcon(index)}
                    </button>
                    <div>
                      <CardTitle className="text-lg">{phase.phase}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Estimated time: {getEstimatedTime(index)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={completedPhases.has(index) ? 'default' : 'secondary'}>
                    Phase {index + 1}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Skills to Learn
                    </h4>
                    <div className="space-y-1">
                      {phase.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="mr-1 mb-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Courses */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      Recommended Courses
                    </h4>
                    <div className="space-y-1">
                      {phase.courses.map((course, courseIndex) => (
                        <div key={courseIndex} className="text-sm text-muted-foreground">
                          • {course}
                        </div>
                      ))}
                      {phase.courses.length === 0 && (
                        <div className="text-sm text-muted-foreground italic">
                          Self-study recommended
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <Code className="h-4 w-4" />
                      Practice Projects
                    </h4>
                    <div className="space-y-1">
                      {phase.projects.map((project, projectIndex) => (
                        <div key={projectIndex} className="text-sm text-muted-foreground">
                          • {project}
                        </div>
                      ))}
                      {phase.projects.length === 0 && (
                        <div className="text-sm text-muted-foreground italic">
                          Create your own projects
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant={completedPhases.has(index) ? "secondary" : "default"}
                    size="sm"
                    onClick={() => togglePhaseCompletion(index)}
                    className="mr-2"
                  >
                    {completedPhases.has(index) ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                  {index < roadmap.length - 1 && (
                    <Button variant="outline" size="sm">
                      Next Phase
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && roadmap.length === 0 && !error && (
        <Card className="text-center py-8">
          <CardContent>
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Roadmap Available</h3>
            <p className="text-muted-foreground mb-4">
              Select a career path to generate a personalized learning roadmap.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Roadmap;
