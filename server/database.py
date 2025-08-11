
import os
import psycopg2  # type: ignore
from psycopg2.extras import RealDictCursor  # type: ignore
from dotenv import load_dotenv

load_dotenv("./.env")

# Create a reusable connection function
def get_connection():
    print("Connecting:")
    print(f"HOST:{os.getenv('DB_HOST')}")
    print(f"USER:{os.getenv('DB_USER')}")
    print(f"PSWD:{os.getenv('DB_PSWD')}")
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PSWD"),
        cursor_factory=RealDictCursor
    )
