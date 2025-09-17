from fastapi import APIRouter
from pydantic import BaseModel
from ..services.recommender import recommend_careers

router = APIRouter(prefix="", tags=["recommend"])

class Profile(BaseModel):
    profile: dict

@router.post("/recommend")
def recommend(body: Profile):
    recs = recommend_careers(body.profile)
    return {"recommendations": recs}
