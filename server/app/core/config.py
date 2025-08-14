from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    jwt_secret_key: str
    access_token_expire_minutes: int
    algorithm : str
    class Config:
        env_file = ".env"
        env_prefix = ""  # optional, no prefix
        case_sensitive = False 

settings = Settings()