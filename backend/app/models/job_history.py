from typing import List
from pydantic import BaseModel, Field
from bson import ObjectId # type: ignore
from models.base import PyObjectId  # type: ignore

class JobApplicationHistoryInDB(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    candidate_id: PyObjectId
    job_posts: List[PyObjectId]
    application_statuses: List[str] = ["pending"]

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True
