from fastapi import APIRouter
from pydantic import BaseModel
from ..services.embeddings import embed_text

router = APIRouter(prefix="", tags=["embed"])

class EmbedIn(BaseModel):
    text: str

@router.post("/embed")
def embed(inb: EmbedIn):
    vec = embed_text(inb.text)
    return {"embedding": vec.tolist()}
