from datetime import datetime
from pydantic import BaseModel
from models.base import PyObjectId 
from bson import ObjectId # type: ignore
# Response schema for the resume upload endpoint
class ResumeFiles(BaseModel):
    job_id: str
    job_title: str
    candidate_username: str
    hr_username: str
    resume: bytes
class ResumeUploadResponse(BaseModel):
    candidate_username: str
    hr_username: str
    file_name: str
    uploaded_at: datetime

    class Config:
        orm_mode = True  # This allows compatibility with ORM models (e.g., MongoDB or SQLAlchemy)

class ApplicationResponse(BaseModel):
    application_id: str
    candidate_username: str
    job_title: str
    filename: str

    class Config:
        orm_mode = True
        json_encoders = {ObjectId: str}  