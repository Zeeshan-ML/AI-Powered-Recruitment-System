import zipfile
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException,status
from typing import List
from datetime import datetime
import os
from pathlib import Path
from endpoints.auth import get_current_user, oauth2_scheme
from schemas.application import ResumeUploadResponse, ResumeFiles, ApplicationResponse
from models.application import ApplicationInDB
from database.database import db
from fastapi.responses import Response
import uuid

async def get_candidate_id(db, candidate_username: str):
    candidate = await db["candidates"].find_one({"username": candidate_username})
    if candidate:
        return candidate["_id"]  # ObjectId
    return None  # Handle case where candidate is not found

async def get_job_id(job_title: str):
    # Use motor to query asynchronously
    job = db["jobs"].find_one({"job_title": job_title})
    if job:
        return str(job["_id"])  # Assuming job has an _id field
    else:
        raise HTTPException(status_code=404, detail="Job not found")


def check_user_role(current_user: dict = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can upload resumes!"
        )
    return current_user

# Create the router for job-related endpoints
router = APIRouter()

@router.post("/upload-resume", response_model=ResumeUploadResponse)
async def upload_resume(
    job_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),  # Authenticated user details
    _ = Depends(check_user_role),  # Ensure only candidates can upload resumes
):
    candidate_username = current_user.username  # Extract from authentication

    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Read file content as bytes
    file_content = await file.read()
    file_size = len(file_content)
   # Assuming `db` is your MongoDB database object
    # jobs_cursor = db["jobs"].find({}, {"_id": 1})  # Fetch only _id
    # job_ids = [str(job["_id"]) for job in jobs_cursor]  # Convert ObjectId to string

    # print("Job IDs:", job_ids)

    # Fetch job details to get job title and HR username
    job_record = db["jobs"].find_one({"_id": ObjectId(job_id)})
    if not job_record:
        raise HTTPException(status_code=404, detail="Job not found.")
    
    job_title = job_record["job_title"]
    hr_username = job_record["hr_username"]

    # Generate metadata
    timestamp = datetime.utcnow()
    filename = f"{candidate_username}_{datetime.today().date()}.pdf"

    # Store resume details in MongoDB
    application = ApplicationInDB(
        job_title=job_title,
        job_id=job_id,
        candidate_username=candidate_username,
        hr_username=hr_username,
        resume=file_content,
        filename=filename,
        content_type=file.content_type,
        file_size=file_size,
        date_uploaded=timestamp,
        updated_at=timestamp,
    )

    # Insert into MongoDB asynchronously
    try:
        db["applications"].insert_one(application.dict(by_alias=True))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save resume in database: {str(e)}"
        )

    return ResumeUploadResponse(
        candidate_username=candidate_username,
        hr_username=hr_username,
        file_name=filename,
        uploaded_at=timestamp
    )


from fastapi.responses import StreamingResponse
from io import BytesIO
from bson import ObjectId # type: ignore

@router.get("/download-resume/{application_id}")
async def download_resume(application_id: str):
    # Fetch the application from the database
    application = db["applications"].find_one({"_id": ObjectId(application_id)})
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")
    
    # Extract the binary resume data
    resume_binary = application.get("resume")
    
    # Create a BytesIO stream from the binary data
    pdf_stream = BytesIO(resume_binary)
    
    # Serve the PDF as a streaming response
    return StreamingResponse(pdf_stream, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={application_id}_resume.pdf"})

@router.get("/get-resume/{application_id}")
async def get_resume(application_id: str, current_user: dict = Depends(get_current_user)):
    # Debugging logs
    
    # Fetch the application from the database using the ObjectId
    application = db["applications"].find_one({"_id": ObjectId(application_id)})
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")
    
    
    # Ensure the user has the right to access the application (HR or the candidate themselves)
    if current_user.username != application.get("candidate_username"):
        raise HTTPException(status_code=403, detail="You do not have permission to view this resume.")
    
    # Extract the binary resume data
    resume_binary = application.get("resume")
    
    # Check if the resume exists in the database
    if not resume_binary:
        raise HTTPException(status_code=404, detail="Resume not found.")
    
    # Create a BytesIO stream from the binary data
    pdf_stream = BytesIO(resume_binary)
    
    # Serve the PDF as a streaming response
    return StreamingResponse(pdf_stream, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={application_id}_resume.pdf"})

@router.get("/get-job-resumes/{job_id}")
async def get_job_resumes(job_id: str):
    # Validate job ID format
    try:
        job_oid = job_id
    except:
        raise HTTPException(status_code=400, detail="Invalid job ID format")

    # Find all applications for this job
    applications_cursor = db["applications"].find({"job_id": job_oid})
    applications = list(applications_cursor)

    if not applications:
        raise HTTPException(status_code=404, detail="No applications found for this job")

    # Create in-memory zip buffer
    zip_buffer = BytesIO()
    
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for app in applications:
            if app.get("resume"):
                # Create filename with candidate username and application ID
                app_id = str(app["_id"])
                username = app.get("candidate_username", "unknown")
                filename = f"{username}_{app_id}_resume.pdf"
                
                # Add PDF to zip
                zip_file.writestr(filename, app["resume"])

    # Check if any resumes were added
    if zip_file.namelist() == []:
        raise HTTPException(status_code=404, detail="No resumes found for this job")

    # Prepare response
    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename=job_{job_id}_resumes.zip",
            "Content-Type": "application/zip"
        }
    )

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from langchain import PromptTemplate, LLMChain
import os
import tempfile


groq_api_key = "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"

def analyze_resume(job_description: str, resume_path: str):
    llm = ChatGroq(groq_api_key=groq_api_key, model="Llama-3.3-70B-SpecDec")
    loader = PyPDFLoader(resume_path)
    docs = loader.load()
    resume_text = " ".join([doc.page_content for doc in docs])
    
    prompt_template = """
        ### Job Description:
        {job_description}

        ### Candidate's Resume:
        {resume_text}

        ### Task:
        Analyze the candidate's resume against the job description and determine the level of alignment.  
        - **Strictly** follow the job description and consider every requirement carefully.  
        - **Think step by step** before making a final decision.  
        - **If even one critical requirement is missing**, the candidate should not be considered a good fit.  

        ### **Instructions:**
        - **Only list matched skills** in the "Matching Skills" section.  
        - **Do not include irrelevant skills** that are not part of the job description.  
        - The "Score" should be a **single numerical value (0-100%)** followed by a percentage sign (e.g., 85%).  
        - The "Conclusion" should be either **"Good Fit"** or **"Not Good Fit"** with no extra explanation.  
        - The "Reason" should be **a short, clear justification** for the classification.  
        - **Do not assume missing skills. If a skill is not explicitly mentioned in the resume, do not consider it.**  
        - **Prioritize the most important skills and qualifications from the job description.**  

        ### **Evaluation Criteria:**
        1. **Extract and list only the skills that are explicitly mentioned** in both the job description and resume.  
        2. **Check if the resume meets all critical requirements** (e.g., experience, education, certifications, technical skills).  
        3. **Calculate a match percentage (0-100%)** based on the presence of required skills and qualifications.  
        4. **If any major requirement is missing, lower the score significantly.**  
        5. If the score is **above 80%**, classify the candidate as a **Good Fit**; otherwise, classify them as **Not Good Fit**.  
        6. **Ensure that conclusions are accurate**—if the candidate lacks key requirements, they must be marked as **Not Good Fit**.  
        7. **Follow a logical step-by-step assessment** and avoid arbitrary conclusions.  

        ### **Output Format (Strictly Follow This Format ):**
        Matching Skills: **[All Matching Skills]**
        Score: **[X%]**  
        Conclusion: **[Good Fit / Not Good Fit]**  
        Reason: **[One-line reason for classification]**  
        """
    
    prompt = PromptTemplate(
        input_variables=["job_description", "resume_text"],
        template=prompt_template
    )
    
    llm_chain = LLMChain(llm=llm, prompt=prompt)
    return llm_chain.invoke({"job_description": job_description, "resume_text": resume_text})

@router.post("/analyze")
async def analyze(
    job_desc: str = Form(...),
    resume: UploadFile = File(...),
):
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        content = await resume.read()
        temp_file.write(content)
        temp_file_path = temp_file.name

    try:
        result = analyze_resume(job_desc, temp_file_path)
        return {"result": result["text"]}
    finally:
        os.unlink(temp_file_path)


@router.get("/get-job-resumess/{job_id}", response_model=List[ApplicationResponse])
async def get_job_resumes(job_id: str):
    # Validate job ID format
    try:
        job_oid = job_id
    except:
        raise HTTPException(status_code=400, detail="Invalid job ID format")

    # Find all applications for this job
    
    applications_cursor = db["applications"].find({"job_id": job_oid})
    applications = list(applications_cursor)

    if not applications:
        raise HTTPException(status_code=404, detail="No applications found for this job")

    # Prepare the response list with only required fields
    response_data = []
    for app in applications:
        # Only include applications that have a resume
        if app.get("resume"):
            response_data.append(
                ApplicationResponse(
                    application_id = str(app["_id"]),  # Will be automatically converted to string
                    candidate_username=app.get("candidate_username", "unknown"),
                    job_title=app.get("job_title", "N/A"),
                    filename=app.get("filename", "no_filename.pdf")
                )
            )

    return response_data