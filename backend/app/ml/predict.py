import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import logging
import joblib
from backend.app.core.config import settings
from backend.app.ml.preprocessing import clean_text, format_email_input

logger = logging.getLogger("MailGuardPredict")

_MODEL_CACHE = None

SPAM_KEYWORDS = [
    "urgent", "suspended", "verify", "password", "lottery", "prize", "cash",
    "free", "winner", "bitcoin", "crypto", "refund", "invoice", "bank",
    "wire transfer", "login", "update your account", "immediately", "urltoken",
    "moneytoken"
]

def get_model():
    """
    Loads and caches the trained ML pipeline artifact.
    """
    global _MODEL_CACHE
    if _MODEL_CACHE is None:
        if not settings.MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Trained model artifact not found at {settings.MODEL_PATH}. "
                "Please run train.py to generate the model artifact."
            )
        logger.info(f"Loading model artifact from {settings.MODEL_PATH}...")
        _MODEL_CACHE = joblib.load(settings.MODEL_PATH)
    return _MODEL_CACHE

def extract_threat_indicators(text: str) -> list[str]:
    """
    Identifies high-risk indicators and suspicious patterns in the email.
    """
    text_lower = text.lower()
    found = []
    for kw in SPAM_KEYWORDS:
        if kw in text_lower:
            display_name = kw.replace("token", "").capitalize() if "token" in kw else kw.title()
            if display_name not in found:
                found.append(display_name)
    return found[:5]

def predict_email(subject: str | None, email_text: str) -> dict:
    """
    Infers classification for an email and returns structured threat metadata.
    """
    if not email_text or not email_text.strip():
        raise ValueError("Email body text cannot be empty.")
    
    model_data = get_model()
    pipeline = model_data["pipeline"]
    model_version = model_data.get("model_version", "v1.0")

    formatted_input = format_email_input(subject, email_text)
    
    # Predict label (0 = Ham / NOT_SPAM, 1 = Spam / SPAM)
    pred_idx = int(pipeline.predict([formatted_input])[0])
    label = "SPAM" if pred_idx == 1 else "NOT_SPAM"

    # Probabilities
    confidence = None
    try:
        probs = pipeline.predict_proba([formatted_input])[0]
        # Return probability for the predicted class as a float between 0.0 and 1.0
        confidence = round(float(probs[pred_idx]), 4)
    except Exception as e:
        logger.warning(f"Could not calculate prediction probability: {e}")

    indicators = extract_threat_indicators(formatted_input)

    return {
        "predicted_label": label,
        "confidence": confidence,
        "model_version": model_version,
        "indicators": indicators,
        "text_length": len(email_text)
    }

