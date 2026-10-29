# MailGuard AI SQLite Database Directory

This directory stores the local SQLite database file `mailguard.db`.

## Database File
- **Path**: `backend/data/mailguard.db`
- **Engine**: SQLite 3
- **ORM**: SQLAlchemy 2.0+

## Tables
1. `predictions`: Stores individual email analysis results, classification verdicts, confidence levels, and timestamps.
2. `model_metadata`: Stores metadata, versioning information, and empirical evaluation metrics for active machine learning models.
3. `activity_logs`: Logs operational events such as database initialization, model training, and history deletion.

## Backup Instructions
To back up the database, simply copy `mailguard.db` to a safe location while the application is idle:
```bash
cp backend/data/mailguard.db backend/data/mailguard_backup_$(date +%Y%m%d).db
```
To restore, replace `mailguard.db` with the backup copy.
