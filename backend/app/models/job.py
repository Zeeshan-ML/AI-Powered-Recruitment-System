from datetime import datetime
from enum import Enum
from typing import List
from pydantic import BaseModel, Field
from bson import ObjectId # type: ignore
from models.base import PyObjectId  # type: ignore

class JobStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"

    @classmethod
    def __get_pydantic_json_schema__(cls, *args, **kwargs):
        return {
            "type": "string",
            "enum": [status.value for status in cls],
        }

class JobPostInDB(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hr_username: str
    job_title: str
    job_description: str
    skills_required: List[str]
    location: str
    experience_required: str
    salary_range: str
    status: JobStatus = JobStatus.OPEN
    date_posted: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True
