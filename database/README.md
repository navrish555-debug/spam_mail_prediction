# MailGuard AI Database Architecture

This directory outlines the database schema, SQLite configuration, and migrations strategy for MailGuard AI.

## Relational Schema Diagram

```
+-------------------------------------------------------+
|                      predictions                      |
+-------------------------------------------------------+
| id               | INTEGER PRIMARY KEY AUTOINCREMENT  |
| subject          | VARCHAR(255) NULLABLE              |
| email_text       | TEXT NOT NULL                      |
| predicted_label  | VARCHAR(20) NOT NULL [SPAM/NOT_SPAM]|
| confidence       | FLOAT NULLABLE                     |
| model_version    | VARCHAR(50) NOT NULL               |
| created_at       | DATETIME NOT NULL (UTC)            |
+-------------------------------------------------------+

+-------------------------------------------------------+
|                    model_metadata                     |
+-------------------------------------------------------+
| id               | INTEGER PRIMARY KEY AUTOINCREMENT  |
| model_version    | VARCHAR(50) UNIQUE NOT NULL        |
| algorithm        | VARCHAR(100) NOT NULL              |
| dataset_name     | VARCHAR(100) NOT NULL              |
| trained_at       | DATETIME NOT NULL (UTC)            |
| accuracy         | FLOAT NOT NULL                     |
| precision        | FLOAT NOT NULL                     |
| recall           | FLOAT NOT NULL                     |
| f1_score         | FLOAT NOT NULL                     |
| is_active        | BOOLEAN DEFAULT TRUE NOT NULL      |
+-------------------------------------------------------+

+-------------------------------------------------------+
|                     activity_logs                     |
+-------------------------------------------------------+
| id               | INTEGER PRIMARY KEY AUTOINCREMENT  |
| event_type       | VARCHAR(50) NOT NULL               |
| description      | VARCHAR(255) NOT NULL              |
| created_at       | DATETIME NOT NULL (UTC)            |
+-------------------------------------------------------+
```

## Migration & Version Control
The schema is managed with SQLAlchemy declarative models in `backend/app/models/`. For schema migrations, Alembic is configured in `backend/migrations/`.
Automatic initialization runs on server startup via `backend/app/db/init_db.py`.
