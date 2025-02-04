from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field
from bson import ObjectId # type: ignore
from models.base import PyObjectId  # type: ignore

class ApplicationInDB(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")  
    job_id: str
    job_title: str
    candidate_username: str  # Ensure this field is populated correctly
    hr_username: str  
    resume: bytes  
    filename: str  
    content_type: str  
    file_size: int 
    date_uploaded: datetime = Field(default_factory=datetime.utcnow)  
    updated_at: datetime = Field(default_factory=datetime.utcnow)  

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

