from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import ValidationError
import numpy as np
from app.services.hunter import vectorize_query
from app.db.upstash_vector import index

router = APIRouter()

# Recruiter Query
@router.get("/query")
def searching_recruiter(query):
    try:
        # Vectorize Query
        vector = vectorize_query(query)

        # Search Query in db
        result = index.query(
            vector=vector,
            top_k=3,
            include_metadata=True,
            include_vectors=False
        )

        return { "query_result" : result }

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
