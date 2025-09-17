"""Embeddings with optional sentence-transformers fallback to TF-IDF hashing"""
from __future__ import annotations
import os
import numpy as np

try:
    from sentence_transformers import SentenceTransformer
    _MODEL: SentenceTransformer | None = SentenceTransformer(os.getenv("EMBED_MODEL","all-MiniLM-L6-v2"))
except Exception:
    _MODEL = None

from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.preprocessing import normalize
_vec = HashingVectorizer(n_features=512, alternate_sign=False)

def embed_text(text: str) -> np.ndarray:
    if _MODEL is not None:
        v = _MODEL.encode([text])[0]
        return np.asarray(v, dtype=np.float32)
    mat = _vec.transform([text])
    arr = mat.toarray().astype(np.float32)
    arr = normalize(arr)
    return arr[0]
