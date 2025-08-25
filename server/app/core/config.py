from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    jwt_secret_key: str
    access_token_expire_minutes: int
    algorithm : str
    email_imap_host:str
    email_smtp_host : str
    email_user: str
    email_pass: str
    linkedin_email: str
    linkedin_password: str
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str
    aws_bucket_name: str
    class Config:
        env_file = ".env"
        env_prefix = ""  # optional, no prefix
        case_sensitive = False 

settings = Settings()