import logging
from backend.app.ml.predict import get_model

logger = logging.getLogger("MailGuardEvaluate")

def get_evaluation_metrics() -> dict:
    """
    Returns authentic evaluation metrics stored in the model artifact.
    """
    model_data = get_model()
    metrics = model_data.get("metrics", {})
    return {
        "model_version": model_data.get("model_version", "v1.0"),
        "algorithm": model_data.get("algorithm", "TF-IDF + Multinomial Naive Bayes"),
        "dataset_name": model_data.get("dataset_name", "UCI SMS Spam Collection + Enterprise Threat Corpus"),
        "trained_at": model_data.get("trained_at"),
        "accuracy": metrics.get("accuracy", 0.0),
        "precision": metrics.get("precision", 0.0),
        "recall": metrics.get("recall", 0.0),
        "f1_score": metrics.get("f1_score", 0.0),
        "confusion_matrix": metrics.get("confusion_matrix", [[0, 0], [0, 0]]),
        "classification_report": metrics.get("classification_report", {}),
        "train_samples": metrics.get("train_samples", 0),
        "test_samples": metrics.get("test_samples", 0),
    }

