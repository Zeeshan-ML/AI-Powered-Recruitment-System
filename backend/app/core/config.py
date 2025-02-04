from pydantic_settings import BaseSettings # type: ignore

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "job_portal"

    class Config:
        env_file = ".env"
        extra = 'ignore'

settings = Settings()