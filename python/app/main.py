
from fastapi import FastAPI
from app.routes import resume

app = FastAPI(
    title="Jobverse AI",
    description="AI Recruitment Platform",
    version="1.0.0",
)

#Register Routes
app.include_router(resume.router , prefix="/resume" , tags=['Resume Parsing'])

#Root endpoint
@app.get("/")
def read_root():
    return {"message" : "Welcome to Jobverse AI"}