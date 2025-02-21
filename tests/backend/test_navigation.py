from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_navigate():
    payload = {"start": [0, 0], "end": [1, 1]}
    response = client.post("/navigate", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Verify the structure of the response
    assert "route" in data
    assert data["route"] == payload.values()

def test_wasm_path():
    payload = {"start": [0, 0], "end": [1, 1]}
    response = client.post("/wasm-path", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "route" in data
