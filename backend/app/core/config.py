import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "MailGuard AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database
    DATA_DIR: Path = BASE_DIR / "data"
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'data' / 'mailguard.db'}"
    
    # Model Artifacts
    ARTIFACTS_DIR: Path = BASE_DIR / "artifacts"
    MODEL_PATH: Path = BASE_DIR / "artifacts" / "spam_classifier_v1.joblib"
    DATASETS_DIR: Path = BASE_DIR / "datasets"
    
    # Gemini AI Integration
    GEMINI_API_KEY: str | None = None

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=(".env", str(BASE_DIR / ".env")),
        extra="ignore",
        case_sensitive=True
    )

settings = Settings()

# Ensure required directories exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
settings.DATASETS_DIR.mkdir(parents=True, exist_ok=True)

