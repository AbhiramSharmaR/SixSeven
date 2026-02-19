from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    FIREBASE_CREDENTIALS_PATH: str
    FIREBASE_PROJECT_ID: str = ""
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
