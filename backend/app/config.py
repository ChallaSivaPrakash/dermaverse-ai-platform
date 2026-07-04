from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/agentic_ecom"
    JWT_SECRET: str = "supersecretkey"
    PORT: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
