import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, User, Mail, Calendar, GraduationCap, Building, Heart } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserData {
  name: string;
  email: string;
  password: string;
  age: string;
  degree: string;
  college: string;
  interests: string[];
}

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Tell us about yourself' },
  { id: 2, title: 'Contact', icon: Mail, description: 'Your email and password' },
  { id: 3, title: 'Age', icon: Calendar, description: 'How old are you?' },
  { id: 4, title: 'Education', icon: GraduationCap, description: 'Your degree level' },
  { id: 5, title: 'Institution', icon: Building, description: 'Where do you study?' },
  { id: 6, title: 'Interests', icon: Heart, description: 'What excites you?' }
];

const DEGREES = [
  'B.Tech', 'B.Sc', 'B.A', 'B.Com', 'BBA', 'BCA',
  'M.Tech', 'M.Sc', 'M.A', 'MBA', 'MCA',
  'Diploma', 'PhD', 'Other'
];

const INTERESTS = [
  'Artificial Intelligence', 'Machine Learning', 'Web Development', 'Mobile Development',
  'Data Science', 'Cybersecurity', 'Cloud Computing', 'DevOps',
  'UI/UX Design', 'Graphic Design', 'Product Design', 'Animation',
  'Digital Marketing', 'Content Marketing', 'Social Media', 'SEO',
  'Finance', 'Investment Banking', 'Accounting', 'Economics',
  'Healthcare', 'Medicine', 'Nursing', 'Pharmacy',
  'Blockchain', 'Cryptocurrency', 'IoT', 'Robotics',
  'Research', 'Teaching', 'Consulting', 'Entrepreneurship'
];

const SignupWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    age: '',
    degree: '',
    college: '',
    interests: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!userData.name.trim()) newErrors.name = 'Name is required';
        break;
      case 2:
        if (!userData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Invalid email format';
        if (!userData.password) newErrors.password = 'Password is required';
        else if (userData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        break;
      case 3:
        const age = parseInt(userData.age);
        if (!userData.age) newErrors.age = 'Age is required';
        else if (age < 13 || age > 100) newErrors.age = 'Age must be between 13 and 100';
        break;
      case 4:
        if (!userData.degree) newErrors.degree = 'Degree is required';
        break;
      case 5:
        if (!userData.college.trim()) newErrors.college = 'College/Institution is required';
        break;
      case 6:
        if (userData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const toggleInterest = (interest: string) => {
    setUserData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setIsLoading(true);
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        age: parseInt(userData.age),
        degree: userData.degree,
        college: userData.college,
        interests: userData.interests,
        createdAt: new Date().toISOString()
      });

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Navigate to dashboard with demo user
    navigate('/dashboard?demo=true');
  };

  const progress = (currentStep / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep - 1];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-background cosmic-grid flex items-center justify-center p-4">
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full">
        <div className="w-full h-full opacity-10 bg-primary blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-foreground">Join Prismiq</h1>
            <span className="text-sm text-muted-foreground">{currentStep} of {STEPS.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="cosmic-glass border-border backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl font-medium text-foreground">{currentStepData.title}</CardTitle>
            <p className="text-muted-foreground">{currentStepData.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Email & Password */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={userData.password}
                    onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Age */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="13"
                    max="100"
                    placeholder="Enter your age"
                    value={userData.age}
                    onChange={(e) => setUserData(prev => ({ ...prev, age: e.target.value }))}
                    className={errors.age ? 'border-destructive' : ''}
                  />
                  {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Degree */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label>Degree Level</Label>
                  <Select value={userData.degree} onValueChange={(value) => setUserData(prev => ({ ...prev, degree: value }))}>
                    <SelectTrigger className={errors.degree ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select your degree" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEGREES.map((degree) => (
                        <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.degree && <p className="text-sm text-destructive">{errors.degree}</p>}
                </div>
              </div>
            )}

            {/* Step 5: College */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="college">College/Institution</Label>
                  <Input
                    id="college"
                    placeholder="Enter your college or institution name"
                    value={userData.college}
                    onChange={(e) => setUserData(prev => ({ ...prev, college: e.target.value }))}
                    className={errors.college ? 'border-destructive' : ''}
                  />
                  {errors.college && <p className="text-sm text-destructive">{errors.college}</p>}
                </div>
              </div>
            )}

            {/* Step 6: Interests */}
            {currentStep === 6 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label>Interests (Select at least one)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                    {INTERESTS.map((interest) => (
                      <div
                        key={interest}
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 px-3 py-1 rounded-full text-sm border ${
                          userData.interests.includes(interest) 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'border-border hover:bg-primary/10 text-foreground'
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </div>
                    ))}
                  </div>
                  {errors.interests && <p className="text-sm text-destructive">{errors.interests}</p>}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 hero-gradient text-white"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 hero-gradient text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Finish Signup
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Demo option */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Don't want to sign up right now?</p>
              <Button
                variant="ghost"
                onClick={handleDemoLogin}
                className="text-primary hover:text-primary/80"
              >
                Try Demo Instead
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign in link */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button
              variant="link"
              onClick={() => navigate('/auth/signin')}
              className="text-primary hover:text-primary/80 p-0 h-auto"
            >
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupWizard;
