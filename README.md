# Prismiq Monorepo

Prismiq — Your Future, Decoded.

This monorepo contains:
- frontend: Next.js + TypeScript + Tailwind UI
- server: Node.js Express API gateway (Firestore + ML proxy)
- ml-service: Python FastAPI service (embeddings, recommender, roadmap, chat)
- infra: deployment and seed scripts

Run everything locally with Docker Compose, or deploy: Vercel (frontend), Render (server + ml-service).

## Architecture

```
[Frontend (Next.js)]  <--HTTP-->  [Server (Express)]  <--HTTP-->  [ML Service (FastAPI)]
       |                                              
       | Firestore (listeners)                         
       v                                              
[Firebase Firestore]  (users/demo-user/{recommendations,roadmaps,chats})
```

## Quickstart (Docker)
1. Copy .env.example to .env and fill values (no secrets committed)
2. docker-compose up --build
3. Open http://localhost:3000 (frontend)

## Packages
- Node 18+, Python 3.11+
- Frontend: Next.js App Router, Tailwind, Firebase SDK
- Server: Express, firebase-admin, axios, joi, helmet, pino
- ML: FastAPI, scikit-learn, sentence-transformers (optional), LangChain

## Environments
See .env.example for variables used by each service.

## Tests
- frontend: npm test (Jest)
- server: npm test (Jest)
- ml-service: pytest

## Security
See SECURITY.md for production hardening.

## Demo Script
See DEMO.md for a guided flow.
