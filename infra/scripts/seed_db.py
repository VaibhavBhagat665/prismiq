import os
import time
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

project_id = os.getenv("FIREBASE_PROJECT_ID")
client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
private_key = os.getenv("FIREBASE_PRIVATE_KEY")

if not (project_id and client_email and private_key):
    raise SystemExit("Missing Firebase env vars")

cred = credentials.Certificate({
    "type": "service_account",
    "project_id": project_id,
    "private_key_id": "placeholder",
    "private_key": private_key.replace("\\n", "\n"),
    "client_email": client_email,
    "client_id": "placeholder",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{client_email}"
})

app = firebase_admin.initialize_app(cred)
db = firestore.client()

user_ref = db.collection("users").document("demo-user")
user_ref.set({"createdAt": firestore.SERVER_TIMESTAMP}, merge=True)

rec_ref = user_ref.collection("recommendations").document()
rec_ref.set({
    "createdAt": datetime.utcnow().isoformat(),
    "recommendations": [
        {"career": "Data Scientist", "confidence": 0.84, "tags": ["python","ml","sql"]},
        {"career": "ML Engineer", "confidence": 0.77, "tags": ["pytorch","devops"]},
        {"career": "Data Analyst", "confidence": 0.71, "tags": ["bi","excel"]}
    ]
})

road_ref = user_ref.collection("roadmaps").document()
road_ref.set({
    "createdAt": datetime.utcnow().isoformat(),
    "roadmap": [
        {"phase": "Foundations", "skills": ["Python","Stats"], "courses": ["Intro ML"], "projects": ["EDA"]},
        {"phase": "Intermediate", "skills": ["Pandas","SQL"], "courses": ["Data Wrangling"], "projects": ["Dashboard"]}
    ]
})

chat_ref = user_ref.collection("chats").document()
chat_ref.set({
    "createdAt": datetime.utcnow().isoformat(),
    "messages": [
        {"role": "user", "text": "Hi Prismiq!"},
        {"role": "assistant", "text": "Hello! How can I help with your career today?"}
    ]
})

print("Seeded demo-user data.")
