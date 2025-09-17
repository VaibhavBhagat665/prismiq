from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_embed():
  r = client.post('/embed', json={'text':'hello world'})
  assert r.status_code == 200
  assert 'embedding' in r.json()

def test_recommend():
  r = client.post('/recommend', json={'profile': {'summary':'I love python and machine learning'}})
  assert r.status_code == 200
  js = r.json()
  assert 'recommendations' in js and len(js['recommendations']) >= 1

def test_roadmap():
  r = client.get('/roadmap', params={'career':'Data Scientist'})
  assert r.status_code == 200
  assert 'roadmap' in r.json()
