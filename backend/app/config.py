from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    GEMINI_API_KEY: str = "your_gemini_api_key_here"
    SECRET_KEY: str = "nyayamitra-jwt-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    DATABASE_URL: str = "sqlite+aiosqlite:///./nyayamitra.db"
    BACKEND_CORS_ORIGINS: str = '["http://localhost:5173"]'

    @property
    def cors_origins(self) -> List[str]:
        return json.loads(self.BACKEND_CORS_ORIGINS)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"


settings = Settings()
