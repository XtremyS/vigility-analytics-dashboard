from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Vigility Analytics API"
    secret_key: str = "change-me-in-prod"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = "sqlite:///./analytics.db"
    cors_origin: str = "http://localhost:3000"


settings = Settings()
