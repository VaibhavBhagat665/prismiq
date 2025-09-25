"""Resume processing endpoint with Gemini/Mock adapters"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from typing import List, Dict, Any
import google.generativeai as genai

router = APIRouter()

class ResumeRequest(BaseModel):
    resume_text: str
    user_id: str

class ResumeResponse(BaseModel):
    skills: List[str]
    analysis: Dict[str, Any]

class GeminiAdapter:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def process_resume(self, resume_text: str, user_id: str) -> Dict[str, Any]:
        if not self.model:
            raise Exception("Gemini API key not configured")
        
        prompt = f"""
        Analyze this resume and extract key information:
        
        Resume Text:
        {resume_text}
        
        Please provide analysis in JSON format:
        {{
            "skills": ["skill1", "skill2", ...],
            "experience_years": number,
            "education_level": "string",
            "key_strengths": ["strength1", "strength2", ...],
            "improvement_areas": ["area1", "area2", ...],
            "career_level": "entry/mid/senior",
            "industries": ["industry1", "industry2", ...],
            "score": number (0-100)
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Extract JSON from response
            import json
            import re
            
            text = response.text
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                # Fallback parsing
                return self._extract_skills_fallback(resume_text)
        except Exception as e:
            print(f"Gemini processing error: {e}")
            return self._extract_skills_fallback(resume_text)
    
    def _extract_skills_fallback(self, resume_text: str) -> Dict[str, Any]:
        # Simple keyword extraction as fallback
        common_skills = [
            'python', 'javascript', 'java', 'react', 'node.js', 'sql', 'html', 'css',
            'machine learning', 'data analysis', 'project management', 'communication',
            'leadership', 'problem solving', 'teamwork', 'git', 'docker', 'aws'
        ]
        
        text_lower = resume_text.lower()
        found_skills = [skill for skill in common_skills if skill in text_lower]
        
        return {
            "skills": found_skills[:10],  # Limit to top 10
            "experience_years": 2,
            "education_level": "Bachelor's",
            "key_strengths": found_skills[:3],
            "improvement_areas": ["Portfolio development", "Certification"],
            "career_level": "mid",
            "industries": ["Technology"],
            "score": 75
        }

class MockAdapter:
    def process_resume(self, resume_text: str, user_id: str) -> Dict[str, Any]:
        # Deterministic mock response based on text length and content
        text_lower = resume_text.lower()
        
        # Extract skills based on keywords
        skill_keywords = {
            'python': 'Python',
            'javascript': 'JavaScript',
            'react': 'React',
            'node': 'Node.js',
            'sql': 'SQL',
            'java': 'Java',
            'html': 'HTML',
            'css': 'CSS',
            'machine learning': 'Machine Learning',
            'data': 'Data Analysis',
            'project management': 'Project Management',
            'leadership': 'Leadership',
            'git': 'Git',
            'docker': 'Docker',
            'aws': 'AWS'
        }
        
        found_skills = []
        for keyword, skill in skill_keywords.items():
            if keyword in text_lower:
                found_skills.append(skill)
        
        # Default skills if none found
        if not found_skills:
            found_skills = ['Communication', 'Problem Solving', 'Teamwork']
        
        # Calculate score based on resume length and skills
        score = min(90, max(50, len(resume_text) // 20 + len(found_skills) * 5))
        
        return {
            "skills": found_skills[:8],
            "experience_years": 3,
            "education_level": "Bachelor's Degree",
            "key_strengths": found_skills[:3] if found_skills else ["Communication"],
            "improvement_areas": ["Portfolio development", "Industry certifications"],
            "career_level": "mid" if len(found_skills) > 5 else "entry",
            "industries": ["Technology", "Software Development"],
            "score": score
        }

# Initialize adapters
gemini_adapter = GeminiAdapter()
mock_adapter = MockAdapter()

@router.post("/process_resume", response_model=ResumeResponse)
async def process_resume(request: ResumeRequest):
    try:
        # Try Gemini first, fallback to Mock
        if os.getenv('GEMINI_API_KEY'):
            try:
                analysis = gemini_adapter.process_resume(request.resume_text, request.user_id)
            except Exception as e:
                print(f"Gemini failed, using mock: {e}")
                analysis = mock_adapter.process_resume(request.resume_text, request.user_id)
        else:
            analysis = mock_adapter.process_resume(request.resume_text, request.user_id)
        
        return ResumeResponse(
            skills=analysis.get('skills', []),
            analysis=analysis
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume processing failed: {str(e)}")
