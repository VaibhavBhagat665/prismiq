from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import os
import google.generativeai as genai

router = APIRouter(prefix="", tags=["recommend"])

class RecommendRequest(BaseModel):
    user_profile: Dict[str, Any]
    user_id: str

class GeminiAdapter:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def recommend_careers(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        if not self.model:
            raise Exception("Gemini API key not configured")
        
        prompt = f"""
        Based on this user profile, recommend 5 career paths with detailed information:
        
        Profile: {profile}
        
        Provide recommendations in JSON format:
        {{
            "recommendations": [
                {{
                    "title": "Career Title",
                    "match_percentage": 85,
                    "description": "Brief description",
                    "required_skills": ["skill1", "skill2"],
                    "salary_range": "$60k-90k",
                    "growth_outlook": "High",
                    "next_steps": ["step1", "step2"]
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
                data = json.loads(json_match.group())
                return data.get('recommendations', [])
            else:
                return self._get_fallback_recommendations(profile)
        except Exception as e:
            print(f"Gemini error: {e}")
            return self._get_fallback_recommendations(profile)
    
    def _get_fallback_recommendations(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        interests = profile.get('interests', [])
        degree = profile.get('degree', '')
        
        base_recs = [
            {
                "title": "Software Developer",
                "match_percentage": 88,
                "description": "Build applications and systems using programming languages",
                "required_skills": ["Programming", "Problem Solving", "Debugging"],
                "salary_range": "$70k-120k",
                "growth_outlook": "High",
                "next_steps": ["Learn a programming language", "Build portfolio projects"]
            },
            {
                "title": "Data Analyst",
                "match_percentage": 82,
                "description": "Analyze data to help businesses make informed decisions",
                "required_skills": ["SQL", "Excel", "Data Visualization"],
                "salary_range": "$60k-95k",
                "growth_outlook": "High",
                "next_steps": ["Learn SQL", "Practice with datasets"]
            }
        ]
        
        return base_recs

class MockAdapter:
    def recommend_careers(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        interests = profile.get('interests', [])
        degree = profile.get('degree', 'Computer Science')
        age = profile.get('age', 25)
        
        # Generate recommendations based on profile
        recommendations = []
        
        if 'AI/ML' in interests or 'Data Science' in interests:
            recommendations.append({
                "title": "Machine Learning Engineer",
                "match_percentage": 92,
                "description": "Design and implement ML models and systems",
                "required_skills": ["Python", "TensorFlow", "Statistics", "Data Analysis"],
                "salary_range": "$90k-150k",
                "growth_outlook": "Very High",
                "next_steps": ["Complete ML course", "Build ML projects", "Learn cloud platforms"]
            })
        
        if 'Web Development' in interests:
            recommendations.append({
                "title": "Full Stack Developer",
                "match_percentage": 89,
                "description": "Develop both frontend and backend web applications",
                "required_skills": ["JavaScript", "React", "Node.js", "Databases"],
                "salary_range": "$75k-130k",
                "growth_outlook": "High",
                "next_steps": ["Master JavaScript", "Build full-stack projects", "Learn cloud deployment"]
            })
        
        # Always include these base recommendations
        recommendations.extend([
            {
                "title": "Software Developer",
                "match_percentage": 85,
                "description": "Create software applications and systems",
                "required_skills": ["Programming", "Problem Solving", "Version Control"],
                "salary_range": "$70k-120k",
                "growth_outlook": "High",
                "next_steps": ["Choose a programming language", "Build portfolio", "Practice algorithms"]
            },
            {
                "title": "Product Manager",
                "match_percentage": 78,
                "description": "Guide product development from conception to launch",
                "required_skills": ["Strategy", "Communication", "Analytics", "Leadership"],
                "salary_range": "$80k-140k",
                "growth_outlook": "High",
                "next_steps": ["Learn product management frameworks", "Understand user research", "Practice data analysis"]
            },
            {
                "title": "UX Designer",
                "match_percentage": 75,
                "description": "Design user experiences for digital products",
                "required_skills": ["Design Thinking", "Prototyping", "User Research", "Figma"],
                "salary_range": "$65k-110k",
                "growth_outlook": "Medium",
                "next_steps": ["Learn design tools", "Study UX principles", "Build design portfolio"]
            }
        ])
        
        return recommendations[:5]  # Return top 5

# Initialize adapters
gemini_adapter = GeminiAdapter()
mock_adapter = MockAdapter()

@router.post("/recommend")
def recommend(body: RecommendRequest):
    try:
        # Try Gemini first, fallback to Mock
        if os.getenv('GEMINI_API_KEY'):
            try:
                recommendations = gemini_adapter.recommend_careers(body.user_profile)
            except Exception as e:
                print(f"Gemini failed, using mock: {e}")
                recommendations = mock_adapter.recommend_careers(body.user_profile)
        else:
            recommendations = mock_adapter.recommend_careers(body.user_profile)
        
        return {"recommendations": recommendations}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")
