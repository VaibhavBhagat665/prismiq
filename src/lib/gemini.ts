import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyB92bGbdLvhhw9ykm5mEJlmNzpEjXZuHxc');

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  skillsGaps: string[];
  careerSuggestions: string[];
}

export class GeminiService {
  static async sendChatMessage(message: string, context?: string): Promise<string> {
    try {
      const prompt = context 
        ? `Context: ${context}\n\nUser: ${message}\n\nAs a career counselor AI, provide helpful advice:`
        : `As a career counselor AI, respond to: ${message}`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chat error:', error);
      return 'I apologize, but I encountered an error. Please try again.';
    }
  }

  static async analyzeResume(resumeText: string, userProfile?: any): Promise<ResumeAnalysis> {
    try {
      const profileContext = userProfile 
        ? `User Profile: ${JSON.stringify(userProfile)}` 
        : '';

      const prompt = `
        ${profileContext}
        
        Analyze this resume and provide a comprehensive review:
        
        Resume Content:
        ${resumeText}
        
        Please provide analysis in the following JSON format:
        {
          "score": number (0-100),
          "strengths": ["strength1", "strength2", ...],
          "weaknesses": ["weakness1", "weakness2", ...],
          "recommendations": ["recommendation1", "recommendation2", ...],
          "skillsGaps": ["skill1", "skill2", ...],
          "careerSuggestions": ["career1", "career2", ...]
        }
        
        Focus on:
        1. Technical skills alignment with current market demands
        2. Resume structure and formatting
        3. Experience relevance and presentation
        4. Missing skills for target roles
        5. Career progression opportunities
      `;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        score: 75,
        strengths: ['Professional experience listed', 'Clear contact information'],
        weaknesses: ['Could improve formatting', 'Missing key skills'],
        recommendations: ['Add more quantifiable achievements', 'Include relevant certifications'],
        skillsGaps: ['Modern frameworks', 'Cloud technologies'],
        careerSuggestions: ['Senior Developer', 'Technical Lead']
      };
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw new Error('Failed to analyze resume');
    }
  }

  static async generateRecommendations(userProfile: any, resumeAnalysis?: ResumeAnalysis): Promise<string[]> {
    try {
      const context = `
        User Profile: ${JSON.stringify(userProfile)}
        ${resumeAnalysis ? `Resume Analysis: ${JSON.stringify(resumeAnalysis)}` : ''}
      `;

      const prompt = `
        Based on the user profile and resume analysis, generate 5 personalized career recommendations.
        Focus on:
        1. Skill development opportunities
        2. Career advancement paths
        3. Industry trends alignment
        4. Learning resources
        5. Networking opportunities
        
        Return as a JSON array of strings.
      `;

      const result = await geminiModel.generateContent(context + prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [
        'Consider learning TypeScript for better career prospects',
        'Build a portfolio showcasing your best projects',
        'Network with professionals in your target industry',
        'Pursue relevant certifications in your field',
        'Contribute to open-source projects to gain visibility'
      ];
    } catch (error) {
      console.error('Recommendations error:', error);
      return ['Focus on continuous learning and skill development'];
    }
  }
}
