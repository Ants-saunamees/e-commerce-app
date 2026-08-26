# settings.py

import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Settings:
    # ---------------------------------------------------------
    # APP CONFIG
    # ---------------------------------------------------------
    APP_NAME = os.getenv("APP_NAME", "ecommerce-backend")
    APP_ENV = os.getenv("APP_ENV", "development")
    APP_DEBUG = os.getenv("APP_DEBUG", "true").lower() == "true"
    APP_PORT = int(os.getenv("APP_PORT", 8000))

    # ---------------------------------------------------------
    # DATABASE (POSTGRES)
    # ---------------------------------------------------------
    DATABASE_URL = os.getenv("DATABASE_URL")

    # ---------------------------------------------------------
    # CHROMA VECTOR DB
    # ---------------------------------------------------------
    CHROMA_PATH = os.getenv("CHROMA_PATH")
    CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION")

    # ---------------------------------------------------------
    # EMBEDDING MODEL (Ollama)
    # ---------------------------------------------------------
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
    EMBEDDING_TIMEOUT = int(os.getenv("EMBEDDING_TIMEOUT", 10))

    # ---------------------------------------------------------
    # JWT AUTH
    # ---------------------------------------------------------
    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    JWT_REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", 7))
    REFRESH_TOKEN_KEY = str(os.getenv("REFRESH_TOKEN_KEY"))

    # ---------------------------------------------------------
    # PASSWORD HASHING
    # ---------------------------------------------------------
    HASHING_SCHEME = os.getenv("HASHING_SCHEME", "bcrypt")
    HASHING_ROUNDS = int(os.getenv("HASHING_ROUNDS", 12))

    # ---------------------------------------------------------
    # CORS
    # ---------------------------------------------------------
    CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "")
    CORS_ALLOWED_METHODS = os.getenv("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE")
    CORS_ALLOWED_HEADERS = os.getenv("CORS_ALLOWED_HEADERS", "*")

    # ---------------------------------------------------------
    # REDIS (optional)
    # ---------------------------------------------------------
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
    REDIS_DB = int(os.getenv("REDIS_DB", 0))

    # ---------------------------------------------------------
    # EMAIL (optional)
    # ---------------------------------------------------------
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = os.getenv("SMTP_PORT")
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    SMTP_FROM = os.getenv("SMTP_FROM")

    # ---------------------------------------------------------
    # LOGGING
    # ---------------------------------------------------------
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT = os.getenv("LOG_FORMAT", "default")

    PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
    PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")
    PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")
    PAYPAL_RETURN_URL = os.getenv("PAYPAL_RETURN_URL")
    PAYPAL_CANCEL_URL = os.getenv("PAYPAL_CANCEL_URL")


    TAX_RATE = float(os.getenv("TAX_RATE", "0.20"))
    DB_ECHO = False


settings = Settings()
