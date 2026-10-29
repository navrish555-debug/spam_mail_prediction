def test_history_flow(client):
    # Create two predictions
    p1 = client.post("/api/predictions", json={
        "subject": "Phishing Alert",
        "email_text": "Claim your $1000 prize immediately at urltoken."
    }).json()

    p2 = client.post("/api/predictions", json={
        "subject": "Lunch Discussion",
        "email_text": "Hi Bob, are we still meeting for lunch at noon in cafeteria?"
    }).json()

    # List history
    res = client.get("/api/predictions?page=1&size=10")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 2
    assert len(data["items"]) >= 2

    # Filter by label SPAM
    res_spam = client.get("/api/predictions?label=SPAM")
    assert res_spam.status_code == 200
    for item in res_spam.json()["items"]:
        assert item["predicted_label"] == "SPAM"

    # Search
    res_search = client.get("/api/predictions?search=Lunch")
    assert res_search.status_code == 200
    assert any("Lunch" in (item["subject"] or "") for item in res_search.json()["items"])

    # Detail
    res_detail = client.get(f"/api/predictions/{p1['id']}")
    assert res_detail.status_code == 200
    assert res_detail.json()["id"] == p1["id"]

    # Delete single
    del_res = client.delete(f"/api/predictions/{p1['id']}")
    assert del_res.status_code == 200

    # Verify deleted
    res_after = client.get(f"/api/predictions/{p1['id']}")
    assert res_after.status_code == 404

    # Clear all
    clear_res = client.delete("/api/predictions")
    assert clear_res.status_code == 200
    assert clear_res.json()["deleted_count"] >= 1
