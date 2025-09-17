# Prismiq Demo Walkthrough

1) Seed data (optional):
   - Provide Firebase creds in .env
   - python infra/scripts/seed_db.py
2) Start services: docker-compose up --build
3) Open http://localhost:3000
4) Go to Dashboard and observe recommendations and roadmaps (seeded or generated).
5) Open Chat, send a message; backend writes and reads from Firestore `users/demo-user/chats`.
6) Test API:
   - POST http://localhost:4000/api/recommend
   - GET  http://localhost:4000/api/roadmap?career=Data%20Scientist
   - POST http://localhost:4000/api/chat
