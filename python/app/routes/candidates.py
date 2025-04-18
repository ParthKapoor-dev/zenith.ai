from fastapi import APIRouter, HTTPException, Depends, status, Request
from pydantic import BaseModel, ValidationError
import numpy as np
from app.services.vectorizer import vectorize_candidate
from app.db.upstash_vector import index
from app.models.candidates import Candidate

router = APIRouter()

# Extract Resume Information
@router.get("/resume/extraction")
def extract_resume_data():
    return

# Feeback From Resume
@router.get("/resume/feedback")
def resume_feedback():
    return

# Add/Update Candidate Vector
@router.post("/")
def add_candidate(candidate_data : Candidate):
    try:
        # Validate input
        candidate_id = candidate_data.userId
        vectors = vectorize_candidate(candidate_data)

        index.upsert([
            {"id": candidate_id, "vector": vectors["candidate_vector"], "metadata": vectors["metadata"]}
        ])

        return {"message": "Candidate added successfully!"}

    except ValidationError as e:
        print("Received Err" , str(e))
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        print("Received Err" , str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@router.post("/try")
async def add_candidate(request: Request):
    raw_body = await request.json()
    print("Received Raw Data:", raw_body)  # Debugging
    return {"message": "Candidate added"}
