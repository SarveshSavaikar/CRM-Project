# import os
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from dotenv import load_dotenv

# load_dotenv("./.env")

# DB_HOST=os.getenv("DB_HOST"),
# DB_NAME=os.getenv("DB_NAME"),
# DB_USER=os.getenv("DB_USER"),
# DB_PSWD=os.getenv("DB_PSWD"),

# DATABASE_URL = f"postgresql://{DB_USER}:{DB_PSWD}@{DB_HOST}/{DB_NAME}"

# engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

import os
from databases import Database
from dotenv import load_dotenv

load_dotenv()  # loads .env variables

DATABASE_URL = os.getenv("DATABASE_URL")

database = Database(DATABASE_URL)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()