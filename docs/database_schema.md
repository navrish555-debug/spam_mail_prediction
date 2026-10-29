# MailGuard AI — Database Schema Specification

## Storage Engine
- **Engine**: SQLite 3
- **Location**: `backend/data/mailguard.db`
- **ORM**: SQLAlchemy 2.0+ Declarative Mapping

---

## 1. `predictions` Table
Stores each email evaluated by the application along with classification verdicts and threat metrics.

| Column | Type | Nullable | Primary Key | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | Yes | Auto-incrementing unique identifier |
| `subject` | `VARCHAR(255)` | Yes | No | Subject line of the email |
| `email_text` | `TEXT` | No | No | Raw content/body of the email analyzed |
| `predicted_label` | `VARCHAR(20)` | No | No | Classification result: `'SPAM'` or `'NOT_SPAM'` |
| `confidence` | `FLOAT` | Yes | No | Posterior probability score (0.0 to 1.0) |
| `model_version` | `VARCHAR(50)` | No | No | Identifier of the ML model used (e.g. `'v1.0'`) |
| `created_at` | `DATETIME` | No | No | UTC timestamp of classification |

### Indexes
- `ix_predictions_id`: Primary key index.
- `ix_predictions_predicted_label`: Speeds up label filtering (Spam vs. Legitimate queries).
- `ix_predictions_created_at`: Speeds up date sorting, trend grouping, and range queries.

---

## 2. `model_metadata` Table
Stores provenance, training parameters, and holdout test set evaluation metrics for active ML models.

| Column | Type | Nullable | Primary Key | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | Yes | Unique identifier |
| `model_version` | `VARCHAR(50)` | No | No | Semantic version tag (Unique) |
| `algorithm` | `VARCHAR(100)` | No | No | ML model description |
| `dataset_name` | `VARCHAR(100)` | No | No | Source corpus description |
| `trained_at` | `DATETIME` | No | No | UTC timestamp when model training completed |
| `accuracy` | `FLOAT` | No | No | Test set classification accuracy |
| `precision` | `FLOAT` | No | No | Precision metric on test holdout set |
| `recall` | `FLOAT` | No | No | Recall metric on test holdout set |
| `f1_score` | `FLOAT` | No | No | F1-Score metric on test holdout set |
| `is_active` | `BOOLEAN` | No | No | Flag indicating if this model is in production |

---

## 3. `activity_logs` Table
Audit trail of important application events. Email text is excluded to preserve user confidentiality.

| Column | Type | Nullable | Primary Key | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | No | Yes | Unique log identifier |
| `event_type` | `VARCHAR(50)` | No | No | Event code (`SYSTEM_INIT`, `MODEL_TRAINED`, `EMAIL_ANALYZED`, `RECORD_DELETED`) |
| `description` | `VARCHAR(255)` | No | No | Human-readable event description |
| `created_at` | `DATETIME` | No | No | UTC timestamp |

### Indexes
- `ix_activity_logs_created_at`: For chronological sorting.
