from fastapi import APIRouter
from pydantic import BaseModel
from ..agents.langchain_agent import chat_reply

router = APIRouter(prefix="", tags=["chat"])

class ChatIn(BaseModel):
    message: str
    lang: str | None = None
    user_id: str | None = "demo-user"

@router.post("/chat")
def chat(body: ChatIn):
    reply, sources = chat_reply(body.message, lang=body.lang)
    return {"reply": reply, "sources": sources}
