from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import os
import google.generativeai as genai

router = APIRouter(prefix="", tags=["roadmap"])

class RoadmapRequest(BaseModel):
    career_name: str
    user_id: str

class GeminiAdapter:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def generate_roadmap(self, career_name: str) -> Dict[str, Any]:
        if not self.model:
            raise Exception("Gemini API key not configured")
        
        prompt = f"""
        Create a detailed learning roadmap for becoming a {career_name}. 
        Structure it in 3-4 phases with timeline, skills, and projects.
        
        Provide response in JSON format:
        {{
            "career": "{career_name}",
            "total_duration": "6-12 months",
            "phases": [
                {{
                    "phase": 1,
                    "title": "Foundation",
                    "duration": "2-3 months",
                    "skills": ["skill1", "skill2"],
                    "projects": ["project1", "project2"],
                    "resources": ["resource1", "resource2"]
                }}
            ]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            import json
            import re
            
            text = response.text
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return self._get_fallback_roadmap(career_name)
        except Exception as e:
            print(f"Gemini error: {e}")
            return self._get_fallback_roadmap(career_name)
    
    def _get_fallback_roadmap(self, career_name: str) -> Dict[str, Any]:
        return {
            "career": career_name,
            "total_duration": "6-9 months",
            "phases": [
                {
                    "phase": 1,
                    "title": "Foundation",
                    "duration": "2-3 months",
                    "skills": ["Basic programming", "Problem solving"],
                    "projects": ["Simple calculator", "To-do app"],
                    "resources": ["Online courses", "Documentation"]
                }
            ]
        }

class MockAdapter:
    def generate_roadmap(self, career_name: str) -> Dict[str, Any]:
        career_lower = career_name.lower()
        
        if 'software' in career_lower or 'developer' in career_lower:
            return {
                "career": career_name,
                "total_duration": "8-12 months",
                "phases": [
                    {
                        "phase": 1,
                        "title": "Programming Fundamentals",
                        "duration": "2-3 months",
                        "skills": ["Python/JavaScript", "Data Structures", "Algorithms", "Git"],
                        "projects": ["Calculator App", "Todo List", "Simple Website"],
                        "resources": ["FreeCodeCamp", "Codecademy", "LeetCode"]
                    },
                    {
                        "phase": 2,
                        "title": "Web Development",
                        "duration": "3-4 months",
                        "skills": ["HTML/CSS", "React/Vue", "Node.js", "Databases"],
                        "projects": ["Portfolio Website", "Blog Platform", "E-commerce Site"],
                        "resources": ["MDN Docs", "React Documentation", "MongoDB University"]
                    },
                    {
                        "phase": 3,
                        "title": "Advanced Concepts",
                        "duration": "2-3 months",
                        "skills": ["System Design", "Testing", "DevOps", "Cloud Services"],
                        "projects": ["Scalable Web App", "API Design", "Deployment Pipeline"],
                        "resources": ["AWS Documentation", "System Design Primer", "Docker Docs"]
                    },
                    {
                        "phase": 4,
                        "title": "Job Preparation",
                        "duration": "1-2 months",
                        "skills": ["Interview Prep", "Portfolio Polish", "Networking"],
                        "projects": ["Capstone Project", "Open Source Contributions"],
                        "resources": ["Cracking the Coding Interview", "GitHub", "LinkedIn"]
                    }
                ]
            }
        
        elif 'data' in career_lower or 'analyst' in career_lower:
            return {
                "career": career_name,
                "total_duration": "6-10 months",
                "phases": [
                    {
                        "phase": 1,
                        "title": "Data Fundamentals",
                        "duration": "2-3 months",
                        "skills": ["SQL", "Excel", "Statistics", "Python/R"],
                        "projects": ["Sales Analysis", "Survey Data Analysis"],
                        "resources": ["Khan Academy Statistics", "SQLBolt", "Pandas Documentation"]
                    },
                    {
                        "phase": 2,
                        "title": "Visualization & Tools",
                        "duration": "2-3 months",
                        "skills": ["Tableau/Power BI", "Data Visualization", "Business Intelligence"],
                        "projects": ["Dashboard Creation", "Business Report"],
                        "resources": ["Tableau Public", "Power BI Learning Path"]
                    },
                    {
                        "phase": 3,
                        "title": "Advanced Analytics",
                        "duration": "2-3 months",
                        "skills": ["Machine Learning Basics", "A/B Testing", "Predictive Analytics"],
                        "projects": ["Predictive Model", "A/B Test Analysis"],
                        "resources": ["Coursera ML Course", "Kaggle Learn"]
                    },
                    {
                        "phase": 4,
                        "title": "Portfolio & Job Search",
                        "duration": "1 month",
                        "skills": ["Portfolio Development", "Interview Skills"],
                        "projects": ["Complete Portfolio", "Case Study Presentations"],
                        "resources": ["GitHub Portfolio", "Mock Interviews"]
                    }
                ]
            }
        
        else:
            # Generic roadmap
            return {
                "career": career_name,
                "total_duration": "6-9 months",
                "phases": [
                    {
                        "phase": 1,
                        "title": "Foundation Building",
                        "duration": "2-3 months",
                        "skills": ["Industry Knowledge", "Core Skills", "Tools & Software"],
                        "projects": ["Beginner Project", "Skill Practice"],
                        "resources": ["Online Courses", "Industry Publications"]
                    },
                    {
                        "phase": 2,
                        "title": "Skill Development",
                        "duration": "2-3 months",
                        "skills": ["Advanced Techniques", "Best Practices", "Problem Solving"],
                        "projects": ["Intermediate Project", "Real-world Application"],
                        "resources": ["Specialized Training", "Mentorship"]
                    },
                    {
                        "phase": 3,
                        "title": "Professional Preparation",
                        "duration": "2-3 months",
                        "skills": ["Portfolio Development", "Networking", "Interview Skills"],
                        "projects": ["Capstone Project", "Professional Portfolio"],
                        "resources": ["Industry Events", "Professional Networks"]
                    }
                ]
            }

# Initialize adapters
gemini_adapter = GeminiAdapter()
mock_adapter = MockAdapter()

@router.post("/roadmap")
def roadmap(body: RoadmapRequest):
    try:
        # Try Gemini first, fallback to Mock
        if os.getenv('GEMINI_API_KEY'):
            try:
                roadmap_data = gemini_adapter.generate_roadmap(body.career_name)
            except Exception as e:
                print(f"Gemini failed, using mock: {e}")
                roadmap_data = mock_adapter.generate_roadmap(body.career_name)
        else:
            roadmap_data = mock_adapter.generate_roadmap(body.career_name)
        
        return {
            "roadmap": roadmap_data,
            "phases": roadmap_data.get('phases', [])
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")

# Legacy GET endpoint for backward compatibility
@router.get("/roadmap")
def roadmap_get(career: str, userId: str = "demo-user"):
    return roadmap(RoadmapRequest(career_name=career, user_id=userId))
