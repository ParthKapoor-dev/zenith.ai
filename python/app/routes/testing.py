from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, ValidationError
import numpy as np
from app.services.vectorizer import vectorize_candidate
from app.services.hunter import hunter
from app.db.upstash_vector import index
from tests.testing import mock_candidates

router = APIRouter()

@router.get("/add")
def testing():
    try:

        for candidate in mock_candidates:
            # Validate input
            print("Candidate" , candidate)
            vector = vectorize_candidate(candidate)
            candidate_id = candidate['userId']

            # Add vector to FAISS index
            index.upsert(
                vectors = [
                    (candidate_id , vector)
                ]
            )

        return { "message" : "Successful" }

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





@router.get("/query")
def testing():
    try:

        query1 = "Looking for a Backend Developer experienced in Python and Docker."
        query_vector = hunter(query1, structured_data={})
        result = index.query(
            vector=query_vector,
            top_k=3,
            include_metadata=True,
            include_vectors=False
        )

        return {"query_result": result}

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