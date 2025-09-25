import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { GeminiService, ResumeAnalysis } from '@/lib/gemini';
import { useAuth } from '@/contexts/AuthContext';
import { useDropzone } from 'react-dropzone';

const ResumeReview: React.FC = () => {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const { userProfile } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const analyzeResume = async () => {
    if (!resumeText) return;

    setIsAnalyzing(true);
    try {
      const result = await GeminiService.analyzeResume(resumeText, userProfile);
      setAnalysis(result);
    } catch (error) {
      console.error('Resume analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="prism-glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Upload & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
              <Button variant="outline">Choose File</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-card/30 rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  onClick={analyzeResume}
                  disabled={isAnalyzing}
                  className="ml-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Resume'
                  )}
                </Button>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setUploadedFile(null);
                  setResumeText('');
                  setAnalysis(null);
                }}
              >
                Upload Different File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Score */}
          <Card className="prism-glass border-border/50">
            <CardHeader>
              <CardTitle>Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted-foreground/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.score / 100)}`}
                      className={getScoreColor(analysis.score)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className={`text-lg font-semibold ${getScoreColor(analysis.score)}`}>
                  {getScoreLabel(analysis.score)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Resume Quality Score
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card className="prism-glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <p className="text-sm">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card className="prism-glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <p className="text-sm">{weakness}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="prism-glass border-border/50">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-card/30 rounded-lg">
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skills Gap Analysis */}
      {analysis && analysis.skillsGaps.length > 0 && (
        <Card className="prism-glass border-border/50">
          <CardHeader>
            <CardTitle>Skills Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Based on current market demands, consider developing these skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.skillsGaps.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-orange-500 border-orange-500/50">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career Suggestions */}
      {analysis && analysis.careerSuggestions.length > 0 && (
        <Card className="prism-glass border-border/50">
          <CardHeader>
            <CardTitle>Career Path Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.careerSuggestions.map((career, index) => (
                <div key={index} className="p-4 bg-card/30 rounded-lg hover:bg-card/50 transition-colors">
                  <p className="font-medium">{career}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended based on your profile
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeReview;
