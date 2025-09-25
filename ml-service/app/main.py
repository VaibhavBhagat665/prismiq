"""FastAPI entrypoint mounting all routers and health checks"""
from fastapi import FastAPI
from .api.embed import router as embed_router
from .api.recommend import router as recommend_router
from .api.roadmap import router as roadmap_router
from .api.chat import router as chat_router
from .api.process_resume import router as resume_router

app = FastAPI(title="Prismiq ML Service")

@app.get("/ready")
def ready():
    return {"ok": True}

app.include_router(embed_router)
app.include_router(recommend_router)
app.include_router(roadmap_router)
app.include_router(chat_router)
app.include_router(resume_router)
