from fastapi import APIRouter, HTTPException, Depends, status, WebSocket
from pydantic import ValidationError, BaseModel
import numpy as np
from app.services.hunter import hunter
from app.db.upstash_vector import index 
from typing import Dict


router = APIRouter()

class Request(BaseModel):
    query: str
    structured_data: Dict

# Recruiter Query
@router.post("/query")
async def searching_recruiter(data: Request):
    try:

        (query_vector, metadata_filters) = hunter(data.query, data.structured_data)
        
        search_results = index.query(
            vector=query_vector,
            top_k=5,    
            # filter=metadata_filters,
        )

        print(search_results)

        return {"query_result": search_results} 

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
