import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  X
} from 'lucide-react';

interface ExtractedSkills {
  skills: string[];
}

const ResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      setUploadedFile(file);
      setError(null);
      setSuccess(false);
    }
  };

  const uploadResume = async () => {
    if (!uploadedFile) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const data: ExtractedSkills = await response.json();
      setExtractedSkills(data.skills || []);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedSkills([]);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Upload className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Resume Analysis</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Your Resume
          </CardTitle>
          <CardDescription>
            Upload your PDF resume to extract skills and get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                uploadedFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400 cursor-pointer'
              }`}
              onClick={!uploadedFile ? triggerFileSelect : undefined}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {uploadedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drop your resume here</p>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Button variant="outline">
                    Select PDF File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum file size: 5MB
                  </p>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Upload Button */}
            {uploadedFile && !success && (
              <Button
                onClick={uploadResume}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing resume...</span>
                  <span>Extracting skills</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}

            {/* Success and Extracted Skills */}
            {success && extractedSkills.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-green-600 text-sm font-medium">
                    Resume analyzed successfully!
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Extracted Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {extractedSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    These skills have been saved to your profile and will be used for personalized recommendations.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={triggerFileSelect} variant="outline">
                    Upload Another Resume
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    Get Updated Recommendations
                  </Button>
                </div>
              </div>
            )}

            {/* No Skills Found */}
            {success && extractedSkills.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <p className="text-yellow-600 text-sm">
                  No skills were extracted from the resume. Please try uploading a different file.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Better Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• Ensure your resume is in PDF format</li>
            <li>• Include a clear skills section with technical skills</li>
            <li>• Use standard fonts and formatting</li>
            <li>• Avoid image-based text or complex layouts</li>
            <li>• Keep file size under 5MB</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeUpload;
