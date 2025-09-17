from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.roadmap_generator import generate_roadmap

router = APIRouter(prefix="", tags=["roadmap"])

class RoadmapIn(BaseModel):
    career: str

@router.post("/roadmap")
@router.get("/roadmap")
def roadmap(career: str | None = None, body: RoadmapIn | None = None):
    name = career or (body.career if body else None)
    if not name:
        raise HTTPException(400, "career required")
    data = generate_roadmap(name)
    return {"roadmap": data}
