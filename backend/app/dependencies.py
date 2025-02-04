import os
from dotenv import load_dotenv # type: ignore
from datetime import datetime, timedelta
from jose import jwt # type: ignore
from passlib.context import CryptContext # type: ignore
from database.database import db  # Import your database connection

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")  # Get from .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
