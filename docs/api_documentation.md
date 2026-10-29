# MailGuard AI — REST API Documentation

The MailGuard AI backend is powered by FastAPI and exposes asynchronous REST endpoints conforming to the OpenAPI 3.1 specification.

- **Base URL**: `http://127.0.0.1:8000/api`
- **Interactive Documentation**: `http://127.0.0.1:8000/docs` (Swagger UI)
- **Alternative Specification**: `http://127.0.0.1:8000/redoc` (ReDoc)

---

## 1. System Health

### `GET /api/health`
Returns system status, database connectivity verification, and ML model loaded status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "database_connected": true,
  "model_loaded": true,
  "model_version": "v1.0",
  "app_version": "1.0.0",
  "timestamp": "2026-10-29T04:35:00.000000+00:00"
}
```

---

## 2. Predictions & Analysis

### `POST /api/predictions`
Analyzes an email, classifies it as SPAM or NOT_SPAM, and saves the result in SQLite.

**Request Body:**
```json
{
  "subject": "URGENT: Verify your payroll credentials",
  "email_text": "Please verify your direct deposit account immediately at http://pay-portal.com or salary will be delayed."
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "subject": "URGENT: Verify your payroll credentials",
  "email_text": "Please verify your direct deposit account immediately at http://pay-portal.com or salary will be delayed.",
  "predicted_label": "SPAM",
  "confidence": 0.9995,
  "model_version": "v1.0",
  "created_at": "2026-10-29T04:35:12.123456+00:00",
  "indicators": ["Urgent", "Verify", "Immediately", "Url"]
}
```

---

### `GET /api/predictions`
Retrieves paginated and filtered historical predictions.

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number (>= 1) |
| `size` | integer | `10` | Number of items per page (1 to 100) |
| `search` | string | `null` | Keyword filter across subject and email text |
| `label` | string | `null` | Filter by `SPAM` or `NOT_SPAM` |
| `sort_order` | string | `"desc"` | Sort by `created_at` (`"asc"` or `"desc"`) |

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "subject": "URGENT: Verify your payroll credentials",
      "email_text": "Please verify your direct deposit account immediately...",
      "predicted_label": "SPAM",
      "confidence": 0.9995,
      "model_version": "v1.0",
      "created_at": "2026-10-29T04:35:12.123456+00:00",
      "indicators": ["Urgent", "Verify", "Immediately"]
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10,
  "total_pages": 1
}
```

---

### `GET /api/predictions/{id}`
Returns details for a single prediction.

**Response (200 OK):**
```json
{
  "id": 1,
  "subject": "URGENT: Verify your payroll credentials",
  "email_text": "...",
  "predicted_label": "SPAM",
  "confidence": 0.9995,
  "model_version": "v1.0",
  "created_at": "2026-10-29T04:35:12.123456+00:00",
  "indicators": ["Urgent", "Verify"]
}
```

---

### `DELETE /api/predictions/{id}`
Deletes a single prediction by ID.

**Response (200 OK):**
```json
{
  "message": "Prediction 1 deleted successfully.",
  "id": 1
}
```

---

### `DELETE /api/predictions`
Clears all prediction history from the database.

**Response (200 OK):**
```json
{
  "message": "All prediction history cleared successfully.",
  "deleted_count": 14
}
```

---

## 3. Analytics & Telemetry

### `GET /api/analytics/overview`
Returns high-level KPI counts, 7-day trend history, and class distribution.

**Response (200 OK):**
```json
{
  "overview": {
    "total_emails": 12,
    "spam_count": 4,
    "not_spam_count": 8,
    "spam_percentage": 33.33,
    "avg_confidence": 0.9842
  },
  "trends": [
    {
      "date": "2026-10-23",
      "spam": 0,
      "legitimate": 0,
      "total": 0
    },
    {
      "date": "2026-10-29",
      "spam": 4,
      "legitimate": 8,
      "total": 12
    }
  ],
  "distribution": [
    {
      "name": "Spam Threats",
      "value": 4,
      "percentage": 33.3,
      "color": "#F87171"
    },
    {
      "name": "Legitimate",
      "value": 8,
      "percentage": 66.7,
      "color": "#22C7A9"
    }
  ]
}
```

---

## 4. Model Information & Metrics

### `GET /api/model/info`
Returns active model parameters and training metadata.

**Response (200 OK):**
```json
{
  "model_version": "v1.0",
  "algorithm": "TF-IDF + Multinomial Naive Bayes",
  "dataset_name": "UCI SMS Spam Collection + Enterprise Threat Corpus",
  "trained_at": "2026-10-28T05:03:22+00:00",
  "accuracy": 0.9845,
  "precision": 0.9826,
  "recall": 0.8898,
  "f1_score": 0.9339,
  "is_active": true
}
```

---

### `GET /api/model/metrics`
Returns holdout test set evaluation metrics including confusion matrix and classification report.

**Response (200 OK):**
```json
{
  "model_version": "v1.0",
  "algorithm": "TF-IDF + Multinomial Naive Bayes (alpha=0.1)",
  "dataset_name": "UCI SMS Spam Collection + Enterprise Threat Corpus",
  "trained_at": "2026-10-28T05:03:22+00:00",
  "accuracy": 0.9845,
  "precision": 0.9826,
  "recall": 0.8898,
  "f1_score": 0.9339,
  "confusion_matrix": [
    [903, 2],
    [14, 113]
  ],
  "classification_report": {
    "Legitimate (Ham)": {
      "precision": 0.9847,
      "recall": 0.9978,
      "f1-score": 0.9912,
      "support": 905
    },
    "Spam": {
      "precision": 0.9826,
      "recall": 0.8898,
      "f1-score": 0.9339,
      "support": 127
    }
  },
  "train_samples": 4124,
  "test_samples": 1032
}
```
