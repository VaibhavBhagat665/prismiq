# Prismiq ML Service (FastAPI)

Endpoints:
- POST /embed { text }
- POST /recommend { profile }
- GET/POST /roadmap?career=
- POST /chat { message }

Implements lightweight pipelines with optional sentence-transformers. Falls back to hashing embeddings if model unavailable.

Run: uvicorn app.main:app --reload --port 8000
