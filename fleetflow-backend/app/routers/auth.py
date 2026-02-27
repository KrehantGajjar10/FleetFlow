# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import bcrypt  # <-- We use pure bcrypt now, avoiding the broken passlib
from .. import models, schemas, database

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# --- Pure Bcrypt Hashing Functions ---
def get_password_hash(password: str) -> str:
    # Convert string to bytes, hash it with a salt, and decode back to a string for the database
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Compare the plain text against the hash
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# --- API Routes ---
@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # 1. Check if user already exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # 2. Hash password and save to database
    hashed_pw = get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_pw, role=user.role)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # 1. Find user in the database
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    # 2. Verify user exists AND password is correct
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return {
        "message": "Login successful", 
        "user": {
            "id": db_user.id, 
            "username": db_user.username, 
            "role": db_user.role
        }
    }