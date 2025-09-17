"""Roadmap generator: light template-based multi-phase plan, optionally LLM-assisted later"""
from __future__ import annotations
from typing import List, Dict

BASE_PHASES = [
    ("Foundations", ["Python", "Statistics", "Git"]),
    ("Data Skills", ["Pandas", "SQL", "Visualization"]),
    ("ML Basics", ["Scikit-Learn", "Modeling", "Evaluation"]),
]

COURSES = {
    "Python": ["Automate the Boring Stuff"],
    "Statistics": ["Khan Academy Stats"],
    "Pandas": ["DataCamp Pandas"],
    "SQL": ["Mode SQL"],
    "Visualization": ["Storytelling with Data"],
    "Scikit-Learn": ["Intro to ML - Coursera"],
}

PROJECTS = {
    "Foundations": ["CLI utils", "Git workflow"],
    "Data Skills": ["EDA notebook", "Dashboard"],
    "ML Basics": ["Classification project"],
}

def generate_roadmap(career: str) -> List[Dict]:
    phases = []
    for name, skills in BASE_PHASES:
        courses = [c for s in skills for c in COURSES.get(s, [])]
        projects = PROJECTS.get(name, [])
        phases.append({
            'phase': f"{career}: {name}",
            'skills': skills,
            'courses': courses,
            'projects': projects,
        })
    return phases
