from fastapi import APIRouter , File , UploadFile   
from app.services.parser import extract_information_from_resume
import os

router = APIRouter()

@router.get("/sample")
async def sample_resume_test():
    """
    Endpoint to test with sample Resume
    """
    file_path = os.path.join("tests", "resumes", "test_resume.pdf")
    
    # Extract information using ML
    parsed_data = extract_information_from_resume(file_path)
    
    return {"parsed_data": parsed_data}

@router.post("/parse")
async def create_parsed_resume(file : UploadFile = File(...)):
    """
    Endpoint to parse resume.
    Accepts a file upload and returns parsed data.
    """
    # Placeholder for parsing logic
    return {"message": f"Parsed resume: {file.filename}"}
