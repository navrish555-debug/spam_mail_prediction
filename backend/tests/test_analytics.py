def test_analytics_endpoints(client):
    # Insert test data
    client.post("/api/predictions", json={
        "subject": "Lottery winner",
        "email_text": "You won the lottery cash prize! Send details immediately."
    })
    client.post("/api/predictions", json={
        "subject": "Quarterly Review",
        "email_text": "Please submit your quarterly engineering review documents by Friday."
    })

    # Overview
    res = client.get("/api/analytics/overview")
    assert res.status_code == 200
    data = res.json()
    assert "overview" in data
    assert "trends" in data
    assert "distribution" in data
    assert data["overview"]["total_emails"] >= 2
    assert data["overview"]["spam_count"] >= 1
    assert data["overview"]["not_spam_count"] >= 1

    # Trends
    res_trends = client.get("/api/analytics/trends?days=7")
    assert res_trends.status_code == 200
    assert len(res_trends.json()) == 7

    # Distribution
    res_dist = client.get("/api/analytics/distribution")
    assert res_dist.status_code == 200
    dist_items = res_dist.json()
    assert len(dist_items) == 2
