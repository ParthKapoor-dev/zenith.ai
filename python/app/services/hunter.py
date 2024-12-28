from typing import List, Dict
from datetime import datetime
import numpy as np
from app.services.vectorizer import GLOBAL_SKILL_KEYWORDS as global_skill_keywords , encode_categorical_features , embedding_model

def vectorize_query(query: str) -> np.ndarray:
    """
    Convert recruiter query into a unified vector representation, matching the candidate vector structure.
    """
    # 1. Text Features
    text_feature_vector = embedding_model.encode(query)  # Embed the query text

    # 2. Extract Skill Relevance
    query_lower = query.lower()
    skill_vector = np.zeros(len(global_skill_keywords))
    for idx, skill in enumerate(global_skill_keywords):
        if skill.lower() in query_lower:
            skill_vector[idx] = 1.0  # Assign relevance if skill is explicitly mentioned

    # 3. Numerical Features (Default values for query)
    total_experience = 0.0  # Assume no specific experience requirement in the query
    min_salary = 0.0  # Default to 0, as it's not commonly specified in queries

    # 4. Categorical Features
    # Extract job roles and availability from query, if mentioned
    job_roles = []
    availability = "immediate"  # Default availability
    if "immediate" in query_lower:
        availability = "immediate"
    elif "15 days" in query_lower:
        availability = "15 days"
    elif "2 months" in query_lower:
        availability = "2 months"
    elif "summer vacations" in query_lower:
        availability = "summer vacations"

    categorical_vector = encode_categorical_features([job_roles, availability])

    # Combine all features into a single query vector
    query_vector = np.concatenate([text_feature_vector, skill_vector, [total_experience, min_salary], categorical_vector])
    return query_vector
