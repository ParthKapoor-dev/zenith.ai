from typing import List, Dict, Optional
import numpy as np
import logging
from app.services.encoder import embedding_model  

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def hunt(summarized_query: str, structured_data: Dict):
    try:
        # Step 1: Encode the summarized query into a vector
        query_vector = embedding_model.encode(summarized_query)

        # Step 2: Prepare metadata filters
        metadata_filters = {}

        # Skills Filter: Allow partial matches (e.g., candidates with some but not all required skills)
        if "required_skills" in structured_data and structured_data["required_skills"]:
            metadata_filters["proficient_skills"] = {
                "$in": structured_data["required_skills"]
            }

        # Experience Level Filter: Exact match
        if "experience_level" in structured_data and structured_data["experience_level"]:
            metadata_filters["experience_level"] = structured_data["experience_level"]

        # Employment Type Filter: Exact match
        if "employment_type" in structured_data and structured_data["employment_type"]:
            metadata_filters["employment_type"] = structured_data["employment_type"]

        # Current Job Status Filter: Exact match
        if "current_job_status" in structured_data and structured_data["current_job_status"]:
            metadata_filters["current_job_status"] = structured_data["current_job_status"]

        return (
            query_vector,
            metadata_filters
        )

    except Exception as e:
        logger.error(f"Failed to search candidates: {e}")
        raise