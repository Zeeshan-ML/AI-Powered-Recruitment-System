from typing import Optional
from pydantic import BaseModel, EmailStr
from models.base import PyObjectId
from pydantic import Field
from bson import ObjectId # type: ignore


class UserBase(BaseModel):
    name: str
    username: str
    email: EmailStr
    phone_no: str
    role: str

class UserCreate(UserBase):
    password: str
class UserLogin(BaseModel):
    username: str
    password: str
class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone_no: Optional[str] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    name: str
    username: str
    email: EmailStr
    phone_no: str
    role: str

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None

class TokenResponse(BaseModel):
    name: str
    username: str
    email: EmailStr
    phone_no: str
    role: str
    access_token: str
    token_type: str
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
