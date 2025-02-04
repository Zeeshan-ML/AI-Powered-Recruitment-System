from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId # type: ignore
from models.base import PyObjectId  # type: ignore

class UserRole(str, Enum):
    HR = "hr"
    CANDIDATE = "candidate"

class UserInDB(BaseModel):
    id: PyObjectId = Field(default_factory=str, alias="_id")
    name: str
    username: str
    email: EmailStr
    password: str
    phone_no: str
    role: UserRole
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True
