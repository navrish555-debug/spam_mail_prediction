def test_model_info_and_metrics(client):
    res_info = client.get("/api/model/info")
    assert res_info.status_code == 200
    info = res_info.json()
    assert info["model_version"] == "v1.0"
    assert "Naive Bayes" in info["algorithm"]
    assert info["accuracy"] > 0.90

    res_metrics = client.get("/api/model/metrics")
    assert res_metrics.status_code == 200
    metrics = res_metrics.json()
    assert "confusion_matrix" in metrics
    assert "classification_report" in metrics
    assert metrics["train_samples"] > 1000
    assert metrics["test_samples"] > 100
