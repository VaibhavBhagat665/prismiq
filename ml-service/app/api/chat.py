from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import os
import google.generativeai as genai

router = APIRouter(prefix="", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    user_profile: Optional[Dict[str, Any]] = {}
    lang: str = "en"
    user_id: str

class GeminiAdapter:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def chat_reply(self, message: str, user_profile: Dict[str, Any], lang: str = "en") -> tuple[str, List[str]]:
        if not self.model:
            raise Exception("Gemini API key not configured")
        
        # Build context from user profile
        context = ""
        if user_profile:
            context = f"""
            User Context:
            - Name: {user_profile.get('name', 'User')}
            - Age: {user_profile.get('age', 'Unknown')}
            - Education: {user_profile.get('degree', 'Unknown')} at {user_profile.get('college', 'Unknown')}
            - Interests: {', '.join(user_profile.get('interests', []))}
            """
        
        prompt = f"""
        You are a helpful career counselor AI assistant. Respond to the user's question in {lang}.
        
        {context}
        
        User Question: {message}
        
        Provide helpful, personalized career advice. Be encouraging and specific.
        If the user asks about careers, skills, or professional development, provide actionable guidance.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text, []
        except Exception as e:
            print(f"Gemini chat error: {e}")
            return self._get_fallback_response(message, user_profile, lang), []
    
    def _get_fallback_response(self, message: str, user_profile: Dict[str, Any], lang: str) -> str:
        name = user_profile.get('name', 'there')
        
        if lang == 'es':
            return f"Hola {name}, gracias por tu pregunta. Como consejero de carrera, estoy aquí para ayudarte con tu desarrollo profesional."
        elif lang == 'fr':
            return f"Bonjour {name}, merci pour votre question. En tant que conseiller de carrière, je suis là pour vous aider."
        else:
            return f"Hi {name}, thanks for your question! As a career counselor, I'm here to help you with your professional development. Could you tell me more about what specific area you'd like guidance on?"

class MockAdapter:
    def chat_reply(self, message: str, user_profile: Dict[str, Any], lang: str = "en") -> tuple[str, List[str]]:
        name = user_profile.get('name', 'there')
        interests = user_profile.get('interests', [])
        
        message_lower = message.lower()
        
        # Career-related responses
        if any(word in message_lower for word in ['career', 'job', 'work', 'profession']):
            if interests:
                if lang == 'es':
                    return f"Hola {name}! Basándome en tus intereses en {', '.join(interests)}, te recomiendo explorar carreras relacionadas. ¿Te gustaría que te ayude con un plan específico?", []
                else:
                    return f"Hi {name}! Based on your interests in {', '.join(interests)}, I'd recommend exploring related career paths. Would you like me to help you create a specific career plan?", []
            else:
                return f"Hi {name}! I'd be happy to help with career guidance. Could you tell me about your interests and what type of work excites you?", []
        
        # Skills-related responses
        elif any(word in message_lower for word in ['skill', 'learn', 'study', 'course']):
            if lang == 'es':
                return f"¡Excelente pregunta, {name}! El aprendizaje continuo es clave para el crecimiento profesional. ¿Hay alguna habilidad específica que te interese desarrollar?", []
            else:
                return f"Great question, {name}! Continuous learning is key to career growth. Are there specific skills you're interested in developing? I can help you create a learning roadmap.", []
        
        # Resume/CV related
        elif any(word in message_lower for word in ['resume', 'cv', 'portfolio']):
            return f"Hi {name}! I can definitely help you improve your resume and portfolio. A strong resume should highlight your achievements and skills relevant to your target role. Would you like specific tips?", []
        
        # Interview related
        elif any(word in message_lower for word in ['interview', 'preparation', 'questions']):
            return f"Hi {name}! Interview preparation is crucial for career success. I recommend practicing common questions, researching the company, and preparing specific examples of your achievements. Need help with mock interviews?", []
        
        # Salary/negotiation
        elif any(word in message_lower for word in ['salary', 'negotiate', 'pay', 'compensation']):
            return f"Hi {name}! Salary negotiation is an important skill. Research market rates, document your achievements, and be prepared to articulate your value. Would you like tips on negotiation strategies?", []
        
        # General greeting or unclear
        else:
            if lang == 'es':
                return f"¡Hola {name}! Soy tu consejero de carrera con IA. Puedo ayudarte con planificación de carrera, desarrollo de habilidades, preparación para entrevistas y más. ¿En qué te gustaría que te ayude hoy?", []
            elif lang == 'fr':
                return f"Bonjour {name}! Je suis votre conseiller de carrière IA. Je peux vous aider avec la planification de carrière, le développement des compétences, la préparation aux entretiens et plus encore. Comment puis-je vous aider aujourd'hui?", []
            else:
                return f"Hi {name}! I'm your AI career counselor. I can help you with career planning, skill development, interview preparation, resume reviews, and more. What would you like guidance on today?", []

# Initialize adapters
gemini_adapter = GeminiAdapter()
mock_adapter = MockAdapter()

@router.post("/chat")
def chat(body: ChatRequest):
    try:
        # Try Gemini first, fallback to Mock
        if os.getenv('GEMINI_API_KEY'):
            try:
                reply, sources = gemini_adapter.chat_reply(body.message, body.user_profile, body.lang)
            except Exception as e:
                print(f"Gemini failed, using mock: {e}")
                reply, sources = mock_adapter.chat_reply(body.message, body.user_profile, body.lang)
        else:
            reply, sources = mock_adapter.chat_reply(body.message, body.user_profile, body.lang)
        
        return {"reply": reply, "sources": sources}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")
