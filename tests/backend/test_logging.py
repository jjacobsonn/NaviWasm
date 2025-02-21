from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_error_handling():
    # Send an invalid payload to trigger an error
    response = client.post("/navigate", json={"invalid": "payload"})
    assert response.status_code == 422  # Unprocessable Entity due to schema mismatch
