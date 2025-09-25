"""FastAPI entrypoint mounting all routers and health checks"""
from fastapi import FastAPI
from .api.embed import router as embed_router
from .api.recommend import router as recommend_router
from .api.roadmap import router as roadmap_router
from .api.chat import router as chat_router
from .api.process_resume import router as process_resume_router

app = FastAPI(
    title="Prismiq ML Service",
    description="AI-powered career recommendations and guidance",
    version="1.0.0"
)

# Register routers
app.include_router(embed_router)
app.include_router(recommend_router)
app.include_router(roadmap_router)
app.include_router(chat_router)
app.include_router(process_resume_router)

@app.get("/")
def read_root():
    return {"message": "Prismiq ML Service API"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "prismiq-ml-service",
        "version": "1.0.0"
    }
