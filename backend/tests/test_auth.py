import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_auth_workflow():
    unique_suffix = "test_user_42"
    # 1. Register new user
    register_payload = {
        "username": f"analyst_{unique_suffix}",
        "email": f"{unique_suffix}@mailguard.ai",
        "password": "Password123!",
        "full_name": "Test Security Officer",
        "role": "Security Analyst"
    }
    res_reg = client.post("/api/auth/register", json=register_payload)
    # If already exists from previous run, status can be 400 or 201
    assert res_reg.status_code in [201, 400]

    # 2. Login with Username
    res_login_username = client.post("/api/auth/login", json={
        "username_or_email": f"analyst_{unique_suffix}",
        "password": "Password123!"
    })
    assert res_login_username.status_code == 200
    token_data = res_login_username.json()
    assert "access_token" in token_data
    assert token_data["user"]["username"] == f"analyst_{unique_suffix}"

    # 3. Login with Email
    res_login_email = client.post("/api/auth/login", json={
        "username_or_email": f"{unique_suffix}@mailguard.ai",
        "password": "Password123!"
    })
    assert res_login_email.status_code == 200

    # 4. Access protected profile /me
    token = token_data["access_token"]
    res_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    assert res_me.json()["email"] == f"{unique_suffix}@mailguard.ai"

    # 5. Invalid credentials test
    res_bad = client.post("/api/auth/login", json={
        "username_or_email": f"analyst_{unique_suffix}",
        "password": "WrongPassword!"
    })
    assert res_bad.status_code == 401

