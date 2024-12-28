from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, ValidationError
import numpy as np
from app.services.vectorizer import vectorize_candidate
from app.db.upstash_vector import index

router = APIRouter()

class CandidateData(BaseModel):
    userId: int
    metadata: dict

# Extract Resume Information
@router.get("/resume/extraction")
def extract_resume_data():
    return

# Feeback From Resume
@router.get("/resume/feedback")
def resume_feedback():
    return

# Add Candidate Vector
@router.post("/")
def add_candidate(candidate_data: CandidateData):
    try:
        # Validate input
        vector = vectorize_candidate(candidate_data.dict())
        candidate_id = candidate_data.userId

        # Add vector to FAISS index
        index.upsert(
            vectors = [
                (candidate_id , vector)
            ]
        )

        return {"message": "Candidate added successfully!"}

    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# Update Candidates Vector
@router.put("/{candidate_id}")
def update_candidate(candidate_id: int, candidate_data: CandidateData):
    try:
        # Validate input
        vector = vectorize_candidate(candidate_data.dict())

        # Remove old vector if it exists
        index.delete(candidate_id)

        # Add updated vector
        index.upsert(   
            vectors = [
                (candidate_id , vector)
            ]
        )
        
        return {"message": "Candidate updated successfully!"}

    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

