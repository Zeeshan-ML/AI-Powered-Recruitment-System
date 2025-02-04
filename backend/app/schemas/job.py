from datetime import datetime
from typing import List, Optional
from bson import ObjectId # type: ignore
from pydantic import BaseModel

# Base schema for Job Post
class JobPostBase(BaseModel):
    job_title: str    
    job_description: str
    skills_required: List[str]
    location: str
    experience_required: str
    salary_range: str

# Create schema inherits from JobPostBase, can be extended if needed
class JobPostCreate(JobPostBase):
    pass

class JobPostUpdate(BaseModel):
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    skills_required: Optional[List[str]] = None
    location: Optional[str] = None
    experience_required: Optional[str] = None
    salary_range: Optional[str] = None
    status: Optional[str] = None

class JobPostResponse(JobPostBase):
    job_id: str  # The job_id field instead of id to match the response schema
    hr_username: str
    job_title: str    
    job_description: str
    skills_required: List[str]
    location: str
    experience_required: str
    salary_range: str
    status: str
    date_posted: datetime  # Proper datetime type
    created_at: datetime   # Proper datetime type
    updated_at: datetime   # Proper datetime type

    class Config:
        orm_mode = True  # Important for using ORMs like MongoDB or SQLAlchemy
        json_encoders = {ObjectId: str}  # Ensures ObjectId is serialized as string
