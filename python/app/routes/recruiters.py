from fastapi import APIRouter, HTTPException, Depends, status, WebSocket
from pydantic import ValidationError, BaseModel
import numpy as np
from app.services.hunter import hunt
from app.db.upstash_vector import index

router = APIRouter()

# Recruiter Query
@router.get("/query")
async def searching_recruiter(query, structured_data):
    try:

        (query_vector, metadata_filters) = hunt(query, structured_data)
        
        search_results = index.search(
            vector=query_vector,
            top_k=5,
            metadata_filters=metadata_filters
        )

        candidate_results = []
        for candidate in search_results:
            candidate_results.append({
                "user_id": candidate["id"],
                "score": candidate["score"],
                "metadata": candidate["metadata"]
            })

        return {"query_result", candidate_results}

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
