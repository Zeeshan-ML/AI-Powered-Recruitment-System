from typing import List
from pydantic import BaseModel

class JobApplicationHistoryBase(BaseModel):
    job_posts: List[str]
    application_statuses: List[str]

class JobApplicationHistoryCreate(JobApplicationHistoryBase):
    pass

class JobApplicationHistoryResponse(JobApplicationHistoryBase):
    id: str
    candidate_id: str

    class Config:
        populate_by_name = True