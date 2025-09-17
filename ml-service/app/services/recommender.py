"""Simple recommender: embed profile text -> cosine sim to seed careers -> top3 with calibrated confidence"""
from __future__ import annotations
import json
import numpy as np
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity
from .embeddings import embed_text

DATA = json.loads(Path(__file__).resolve().parents[2].joinpath('data/careers.json').read_text())
CAREER_TEXTS = [f"{c['title']} {c['description']} {' '.join(c.get('skills', []))}" for c in DATA]
CAREER_EMB = None

def _ensure_seed_embeddings():
    global CAREER_EMB
    if CAREER_EMB is not None:
        return
    vecs = [embed_text(t) for t in CAREER_TEXTS]
    CAREER_EMB = np.vstack(vecs)


def recommend_careers(profile: dict) -> list[dict]:
    _ensure_seed_embeddings()
    text = ' '.join(str(profile.get(k, '')) for k in ['summary','skills','education','projects'])
    q = embed_text(text)
    sims = cosine_similarity([q], CAREER_EMB)[0]
    top_idx = sims.argsort()[::-1][:3]
    recs = []
    for i in top_idx:
        conf = float(max(0.0, min(1.0, sims[i])))
        recs.append({
            'career': DATA[i]['title'],
            'confidence': round(conf, 4),
            'tags': DATA[i].get('skills', [])[:5]
        })
    return recs
