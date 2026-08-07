from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "BadmintonIQ API"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    CORS_ORIGINS: list[str] = ["*"]  # override via env var in production, e.g. ["https://yourapp.expo.dev"]

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/badmintoniq"

    # JWT
    SECRET_KEY: str = "change-this-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # File upload
    UPLOAD_DIR: str = "uploads"
    MAX_VIDEO_SIZE_MB: int = 100

    class Config:
        env_file = ".env"


settings = Settings()