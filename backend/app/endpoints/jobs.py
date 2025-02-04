from datetime import datetime, timedelta, timezone
from typing import Annotated, List
import jwt # type: ignore
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError # type: ignore
from passlib.context import CryptContext # type: ignore
from pydantic import BaseModel
from schemas.job import JobPostBase,JobPostCreate,JobPostResponse,JobPostUpdate
from database.database import db
from fastapi import APIRouter
from endpoints.auth import get_current_user

router = APIRouter()
# SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_DAYS = 7  
# ACCESS_TOKEN_EXPIRE_MINUTES = ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60
ACCESS_TOKEN_EXPIRE_MINUTES = 1
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def check_hr_role(current_user: dict = Depends(get_current_user)):
    if current_user.role != "hr":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR users can create job posts"
        )
    return current_user

@router.post("/post-job", response_model=JobPostResponse)
async def create_job(
    job: JobPostCreate,
    current_user: dict = Depends(check_hr_role)
):
    # Prepare job data
    job_data = job.dict()
    
    # Add hr_username (from the current user) so that we know who created the job post.
    job_data["hr_username"] = current_user.username
    
    # Optionally, add timestamps for created and updated times.
    job_data["created_at"] = datetime.utcnow()
    job_data["updated_at"] = datetime.utcnow()
    
    # Set status and date_posted
    job_data["status"] = "Open"  # or any other default value
    job_data["date_posted"] = datetime.utcnow()
    
    # Insert the job post into the jobs collection.
    result = db.jobs.insert_one(job_data)
    
    # Retrieve the created job post.
    created_job = db.jobs.find_one({"_id": result.inserted_id})
    if not created_job:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Job creation failed"
        )
    
    # Convert the MongoDB _id to a string and include it in the response.
    created_job["id"] = str(created_job["_id"])
    
    # Return the created job post data as a JobPostResponse
    return JobPostResponse(
        job_id =created_job["id"],
        job_title=created_job["job_title"],
        job_description=created_job["job_description"],
        skills_required=created_job["skills_required"],
        location=created_job["location"],
        experience_required=created_job["experience_required"],
        salary_range=created_job["salary_range"],
        hr_username=created_job["hr_username"],
        status=created_job["status"],
        date_posted=created_job["date_posted"],
        created_at=created_job["created_at"],
        updated_at=created_job["updated_at"]
    )

@router.get("/get-jobs", response_model=List[JobPostResponse])
async def get_jobs():
    # Fetch all job posts from the database
    jobs_cursor = db.jobs.find()

    # Convert the cursor into a list of job posts
    jobs_list = []
    for job in jobs_cursor:
        # Convert _id to string for proper serialization
        job_id = str(job["_id"])

        # Check if 'hr_username' exists, otherwise set it to a default value
        hr_username = job.get("hr_username", "Unknown")  # Default value if not present
        status = job.get("status", "Unknown")  # Default value for missing status
        date_posted = job.get("date_posted", datetime.utcnow())  # Set default to current time if not available
        created_at = job.get("created_at", datetime.utcnow())  # Default value if not present
        updated_at = job.get("updated_at", datetime.utcnow())  # Default value if not present

        # Append the job data to the jobs list
        jobs_list.append(JobPostResponse(
            job_id=job_id,  # Use job_id (which is the string version of _id)
            job_title=job["job_title"],
            job_description=job["job_description"],
            skills_required=job["skills_required"],
            location=job["location"],
            experience_required=job["experience_required"],
            salary_range=job["salary_range"],
            hr_username=hr_username,  # Safely use hr_username
            status=status,  # Safely use status
            date_posted=date_posted,  # Use the date_posted field
            created_at=created_at,  # Ensure created_at is included
            updated_at=updated_at   # Ensure updated_at is included
        ))

    # If no jobs are found, return an empty list
    if not jobs_list:
        raise HTTPException(
            status_code=404,
            detail="No jobs found"
        )

    return jobs_list

@router.get("/hr-jobs", response_model=List[JobPostResponse])
async def get_hr_jobs(current_user: dict = Depends(get_current_user), 
                      hr_role: dict = Depends(check_hr_role)):
    # Fetch jobs posted by the current HR user (match based on hr_username)
    jobs_cursor = db.jobs.find({"hr_username": current_user.username})

    # Convert the cursor into a list of job posts
    jobs_list = []
    for job in jobs_cursor:
        # Convert _id to string for proper serialization
        job_id = str(job["_id"])

        # Check if 'hr_username' exists, otherwise set it to a default value
        hr_username = job.get("hr_username", "Unknown")
        status = job.get("status", "Unknown")
        date_posted = job.get("date_posted", datetime.utcnow())
        created_at = job.get("created_at", datetime.utcnow())
        updated_at = job.get("updated_at", datetime.utcnow())

        # Append the job data to the jobs list
        jobs_list.append(JobPostResponse(
            job_id=job_id,  # Use job_id (which is the string version of _id)
            job_title=job["job_title"],
            job_description=job["job_description"],
            skills_required=job["skills_required"],
            location=job["location"],
            experience_required=job["experience_required"],
            salary_range=job["salary_range"],
            hr_username=hr_username,  # Safely use hr_username
            status=status,  # Safely use status
            date_posted=date_posted,  # Use the date_posted field
            created_at=created_at,  # Ensure created_at is included
            updated_at=updated_at   # Ensure updated_at is included
        ))

    # If no jobs are found for this HR user, return an empty list
    if not jobs_list:
        raise HTTPException(
            status_code=404,
            detail="No jobs found for this HR user"
        )

    return jobs_list