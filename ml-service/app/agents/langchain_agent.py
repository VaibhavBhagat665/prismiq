"""Lightweight chat orchestration - mock tools; pluggable to LangChain later"""
from __future__ import annotations
from typing import Tuple, List, Dict

DATASETS = {
    'careers': [
        {'title': 'Data Scientist', 'skills': ['python','ml','sql'], 'courses': ['Intro ML']},
        {'title': 'ML Engineer', 'skills': ['pytorch','mlops'], 'courses': ['MLOps Basics']},
    ]
}

def career_search(query: str) -> List[Dict]:
    q = query.lower()
    return [c for c in DATASETS['careers'] if q in c['title'].lower() or any(q in s for s in c['skills'])]

def course_lookup(skill: str) -> List[str]:
    for c in DATASETS['careers']:
        if skill in c['skills']:
            return c['courses']
    return []

def chat_reply(message: str, lang: str | None = None) -> Tuple[str, List[Dict]]:
    hits = career_search(message)
    if hits:
        reply = f"You might explore: {', '.join(h['title'] for h in hits)}."
        return reply, hits
    if 'course' in message.lower():
        reply = f"Consider starting with fundamentals and taking an intro course."
        return reply, []
    return "I can help recommend careers, roadmaps, and courses. Ask me about Data Science or ML!", []
