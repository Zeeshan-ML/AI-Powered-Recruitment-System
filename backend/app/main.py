from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints import auth, jobs,resume,chatbot


app = FastAPI()

# List allowed origins
allowed_origins = [
    "http://localhost:5173",  # Your React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Allow only specific origins
    allow_credentials=True,  # Allow credentials (cookies, authorization headers, etc.)
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include endpoint routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication & User Management"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Job Postings"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume Management"])

# Root route
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Recruitment System API"}

# Run the server only when executing this script directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
