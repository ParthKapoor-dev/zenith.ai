from typing import List, Dict, Optional
import numpy as np
import logging
from app.services.encoder import embedding_model  

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def hunter(summarized_query: str):
    try:
        # Step 1: Encode the summarized query into a vector
        query_vector = embedding_model.encode(summarized_query)

        # Step 2: Prepare metadata filters
        metadata_filters = []

        return(
            query_vector,
            metadata_filters
        )
        # Skills Filter: Allow partial matches (e.g., candidates with some but not all required skills)
        if "required_skills" in structured_data and structured_data["required_skills"]:
            metadata_filters = " OR ".join([f"proficient_skills CONTAINS '{skill}'" for skill in structured_data["required_skills"]])

        # Availability Filter: Exact match
        if "availability" in structured_data and structured_data["availability"]:
            metadata_filters.append(f"availability = {structured_data["availability"]}")

        metadata_filters = " AND ".join([f"{item}" for item in metadata_filters])

        print("filters", metadata_filters)

        return (
            query_vector,
            metadata_filters
        )

    except Exception as e:
        logger.error(f"Failed to search candidates: {e}")
        raise