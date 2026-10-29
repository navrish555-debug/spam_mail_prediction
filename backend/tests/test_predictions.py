def test_predict_spam_email(client):
    payload = {
        "subject": "URGENT: Suspended Account Notice",
        "email_text": "Your account has been suspended! Click here http://bank-verify.com immediately to verify your identity and claim your prize."
    }
    response = client.post("/api/predictions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["predicted_label"] == "SPAM"
    assert data["confidence"] is not None
    assert data["id"] > 0
    assert len(data["indicators"]) > 0

def test_predict_legitimate_email(client):
    payload = {
        "subject": "Sprint Review & Planning Meeting",
        "email_text": "Hello engineering team, please find the agenda for our bi-weekly sprint planning meeting attached. Let me know if you have questions."
    }
    response = client.post("/api/predictions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["predicted_label"] == "NOT_SPAM"
    assert data["id"] > 0

def test_predict_invalid_input(client):
    # Empty text
    response = client.post("/api/predictions", json={"subject": "Test", "email_text": ""})
    assert response.status_code in [422, 400]

    # White space only
    response = client.post("/api/predictions", json={"subject": "Test", "email_text": "  "})
    assert response.status_code in [422, 400]
