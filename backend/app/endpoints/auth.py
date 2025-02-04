from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt # type: ignore
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError # type: ignore
from passlib.context import CryptContext # type: ignore
from pydantic import BaseModel
from schemas.user import UserLogin,UserBase,UserCreate,UserResponse,UserUpdate,Token,TokenData,TokenResponse
from database.database import db
from fastapi import APIRouter

router = APIRouter()
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7  
ACCESS_TOKEN_EXPIRE_MINUTES = ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

users_collection = db.users

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(username: str):
    user_data = users_collection.find_one({"username": username})
    if user_data:
        return UserCreate(**user_data)  # Convert MongoDB document to Pydantic model
    return None
    
def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
@router.post("/login", response_model=TokenResponse)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Authenticate the user
    user = authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create the access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    # Return the access token along with the user details
    return TokenResponse(
        name=user.name,
        username=user.username,
        email=user.email,
        phone_no=user.phone_no,
        role=user.role,
        access_token=access_token,
        token_type="bearer"
    )


@router.get("/users/me/", response_model=UserResponse)
async def read_users_me(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
):
    return current_user

@router.post("/signup", response_model=UserResponse)
async def create_user(user: UserCreate):
    # Check if a user with the same username already exists.
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )
    
    # Convert the incoming data to a dict and hash the password.
    user_data = user.dict()
    plain_password = user_data.pop("password")  # Remove plain-text password
    # Save the hashed password under a separate key (e.g., "hashed_password")
    user_data["password"] = get_password_hash(plain_password)
    
    # Insert the new user into the database.
    result = users_collection.insert_one(user_data)
    
    # Retrieve the newly created user record.
    created_user = users_collection.find_one({"_id": result.inserted_id})
    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user",
        )
    
    # Return the user data in the expected response format.
    return UserResponse(
        name=created_user["name"],
        username=created_user["username"],
        email=created_user["email"],
        phone_no=created_user["phone_no"],
        role=created_user["role"]
    )