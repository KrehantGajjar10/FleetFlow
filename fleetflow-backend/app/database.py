# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# We use SQLite for development. 
SQLALCHEMY_DATABASE_URL = "sqlite:///./fleetflow.db"

# connect_args={"check_same_thread": False} is strictly needed for SQLite in FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency generator to provide a database session to our API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()