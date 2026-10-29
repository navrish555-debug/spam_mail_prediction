import logging
from backend.app.db.base import Base
from backend.app.db.session import engine, SessionLocal
from backend.app.models.user import User
from backend.app.models.prediction import Prediction
from backend.app.models.model_metadata import ModelMetadata
from backend.app.models.activity_log import ActivityLog
from backend.app.core.security import hash_password

logger = logging.getLogger(__name__)

def init_db():
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine, checkfirst=True)
    except Exception as e:
        logger.warning(f"Note during create_all: {e}")
    
    # Self-heal schema migrations (e.g. user_id column)
    try:
        with engine.connect() as conn:
            from sqlalchemy import text
            result = conn.execute(text("PRAGMA table_info(predictions)")).fetchall()
            cols = [row[1] for row in result]
            if "user_id" not in cols:
                conn.execute(text("ALTER TABLE predictions ADD COLUMN user_id INTEGER REFERENCES users(id)"))
                conn.commit()
                logger.info("Added missing user_id column to predictions table.")

            # Check users table columns
            u_res = conn.execute(text("PRAGMA table_info(users)")).fetchall()
            u_cols = [row[1] for row in u_res]
            if "username" not in u_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR(50)"))
                conn.commit()
                logger.info("Added missing username column to users table.")
    except Exception as e:
        logger.warning(f"Note during schema self-heal: {e}")
    
    db = SessionLocal()
    try:
        # Seed default Demo Security Analyst if none exists
        demo_user = db.query(User).filter(User.email == "analyst@mailguard.ai").first()
        if not demo_user:
            demo_user = User(
                username="analyst",
                email="analyst@mailguard.ai",
                hashed_password=hash_password("Password123!"),
                full_name="Alex Vance (Lead Analyst)",
                role="Security Operations Lead"
            )
            db.add(demo_user)
            db.commit()
            logger.info("Created default demo Security Analyst account (analyst@mailguard.ai).")
        elif not demo_user.username:
            demo_user.username = "analyst"
            db.commit()

        # Log initialization event if not logged yet
        log_count = db.query(ActivityLog).count()
        if log_count == 0:
            init_log = ActivityLog(
                event_type="SYSTEM_INIT",
                description="Database initialized successfully."
            )
            db.add(init_log)
            db.commit()
    except Exception as e:
        logger.error(f"Error checking initialization data: {e}")
        db.rollback()
    finally:
        db.close()
    logger.info("Database initialization completed.")

if __name__ == "__main__":
    init_db()
