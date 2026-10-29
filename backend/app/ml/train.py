import os
import sys
from pathlib import Path

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import json
import logging
from datetime import datetime, timezone
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import joblib

from backend.app.core.config import settings
from backend.app.ml.preprocessing import clean_text
from backend.app.db.session import SessionLocal
from backend.app.db.init_db import init_db
from backend.app.models.model_metadata import ModelMetadata
from backend.app.models.activity_log import ActivityLog

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MailGuardTrain")

MODEL_VERSION = "v1.0"
DATASET_NAME = "UCI SMS Spam Collection + Enterprise Threat Corpus"

# Additional realistic enterprise email samples for email header & threat calibration
ENTERPRISE_EMAIL_SAMPLES = [
    # SPAM / PHISHING
    ("spam", "subject: account suspended urgent body: your account has been temporarily suspended due to security violations. verify your credentials at urltoken immediately."),
    ("spam", "subject: urgent payroll update required body: our payroll system failed to process your direct deposit. please submit your bank details via urltoken to avoid salary delays."),
    ("spam", "subject: congratulations! you won $1,000,000 body: you have been selected as the grand prize winner of our global lottery promo. claim your cash award now."),
    ("spam", "subject: crypto wallet security alert body: unauthorized withdrawal request of 2.5 btc detected. if this was not you, cancel immediately at urltoken."),
    ("spam", "subject: overdue invoice #98234 body: your invoice of moneytoken is past due. click urltoken to download receipt and pay immediately to avoid penalties."),
    ("spam", "subject: usps package delivery failed body: your package cannot be delivered due to incomplete address. confirm your details and pay moneytoken fee at urltoken."),
    ("spam", "subject: microsoft 365 password expiring body: your corporate email password will expire in 2 hours. click here to keep current password and prevent account lockout."),
    ("spam", "subject: urgent wire transfer request body: please process an urgent international wire transfer of moneytoken to our new vendor today. confirm once completed."),
    ("spam", "subject: exclusive investment opportunity body: guaranteed 300 percent return on cryptocurrency investment in 7 days. sign up today at urltoken."),
    ("spam", "subject: claim your tax refund online body: the tax revenue service has approved your tax refund of moneytoken. visit urltoken to submit refund form."),

    # HAM / LEGITIMATE
    ("ham", "subject: sprint planning agenda - q4 roadmap body: hi team, please review the agenda for tomorrow's sprint planning session at 10 am. let me know if you have any questions."),
    ("ham", "subject: project status update: phase 2 milestones body: hello everyone, we have successfully completed the database schema design and frontend layout. tracking on schedule."),
    ("ham", "subject: lunch & learn: machine learning best practices body: join us this friday at noon in conference room b for our engineering tech talk. pizza will be provided."),
    ("ham", "subject: pull request #42 review requested body: i have submitted the pull request for the email analyzer component. please take a look when you have a moment."),
    ("ham", "subject: meeting notes: architecture sync body: thanks for attending today's call. summary: we finalized the api specification and test suite structure."),
    ("ham", "subject: quarterly performance reviews body: reminder to schedule your quarterly 1-on-1 check-in before the end of next week using the company calendar."),
    ("ham", "subject: customer support escalation: ticket #1042 body: hi alex, the customer reported an issue with the invoice export. can you investigate the log output?"),
    ("ham", "subject: welcome to the team body: we are excited to welcome sarah to our cybersecurity operations team starting this monday. please say hello!"),
    ("ham", "subject: office holiday schedule body: please note that the office will be closed on monday for the federal holiday. emergency on-call schedule is attached."),
    ("ham", "subject: weekly security patch notice body: standard system maintenance will occur saturday at 2 am utc. expected downtime is under 15 minutes.")
]

def load_and_prepare_dataset():
    tsv_path = settings.DATASETS_DIR / "sms_spam.tsv"
    records = []
    
    if tsv_path.exists():
        logger.info(f"Loading base dataset from {tsv_path}")
        df = pd.read_csv(tsv_path, sep="\t", names=["label", "text"])
        for _, row in df.iterrows():
            label = str(row["label"]).strip().lower()
            text = clean_text(str(row["text"]))
            if text and label in ["ham", "spam"]:
                records.append((label, text))
    else:
        logger.warning(f"TSV dataset not found at {tsv_path}. Proceeding with core samples.")

    # Add enterprise email samples
    for label, text in ENTERPRISE_EMAIL_SAMPLES:
        records.append((label, clean_text(text)))

    full_df = pd.DataFrame(records, columns=["label", "text"])
    full_df.drop_duplicates(subset=["text"], inplace=True)
    full_df["target"] = full_df["label"].map({"ham": 0, "spam": 1})
    
    logger.info(f"Total unique samples: {len(full_df)} (Ham: {(full_df['target'] == 0).sum()}, Spam: {(full_df['target'] == 1).sum()})")
    return full_df

def train_and_evaluate():
    # Ensure database is initialized
    init_db()

    df = load_and_prepare_dataset()
    X = df["text"].values
    y = df["target"].values

    # Stratified Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    logger.info(f"Training set: {len(X_train)} samples, Test set: {len(X_test)} samples")

    # Scikit-learn Pipeline: TF-IDF Vectorizer + Multinomial Naive Bayes
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=6000,
            sublinear_tf=True,
            stop_words="english"
        )),
        ("classifier", MultinomialNB(alpha=0.1))
    ])

    logger.info("Fitting TF-IDF Vectorizer and Multinomial Naive Bayes model...")
    pipeline.fit(X_train, y_train)

    # Evaluation on unseen test data
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()
    report = classification_report(y_test, y_pred, target_names=["Legitimate (Ham)", "Spam"], output_dict=True)

    logger.info("=== Genuine Test Evaluation Metrics ===")
    logger.info(f"Accuracy:  {acc:.4f}")
    logger.info(f"Precision: {prec:.4f}")
    logger.info(f"Recall:    {rec:.4f}")
    logger.info(f"F1-Score:  {f1:.4f}")
    logger.info(f"Confusion Matrix (TN, FP / FN, TP): {cm}")

    # Save model artifact
    settings.ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    artifact_payload = {
        "pipeline": pipeline,
        "model_version": MODEL_VERSION,
        "algorithm": "TF-IDF + Multinomial Naive Bayes (alpha=0.1)",
        "dataset_name": DATASET_NAME,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "metrics": {
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "confusion_matrix": cm,
            "classification_report": report,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
        }
    }

    joblib.dump(artifact_payload, settings.MODEL_PATH)
    logger.info(f"Model artifact successfully saved to: {settings.MODEL_PATH}")

    # Save metadata to SQLite
    db = SessionLocal()
    try:
        # Deactivate old records
        db.query(ModelMetadata).filter(ModelMetadata.model_version == MODEL_VERSION).delete()
        
        metadata = ModelMetadata(
            model_version=MODEL_VERSION,
            algorithm="TF-IDF + Multinomial Naive Bayes",
            dataset_name=DATASET_NAME,
            trained_at=datetime.now(timezone.utc),
            accuracy=round(acc, 4),
            precision=round(prec, 4),
            recall=round(rec, 4),
            f1_score=round(f1, 4),
            is_active=True
        )
        db.add(metadata)
        
        log_entry = ActivityLog(
            event_type="MODEL_TRAINED",
            description=f"Model {MODEL_VERSION} trained: Accuracy={acc*100:.2f}%, F1={f1:.4f}"
        )
        db.add(log_entry)
        db.commit()
        logger.info("Saved model metadata and training activity log to SQLite.")
    except Exception as e:
        logger.error(f"Error persisting metadata: {e}")
        db.rollback()
    finally:
        db.close()

    return artifact_payload

if __name__ == "__main__":
    train_and_evaluate()
