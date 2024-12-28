from sentence_transformers import SentenceTransformer
from typing import List, Dict
from datetime import datetime
import numpy as np

# Load pre-trained sentence embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")  # Lightweight model for production

# A predefined set of skill keywords to start with (can be extended dynamically)
GLOBAL_SKILL_KEYWORDS = [
    "React", "Django", "Python", "Docker", "Deep Learning", "Machine Learning",
    "TensorFlow", "NLP", "JavaScript", "MongoDB", "SQL", "Flask", "Java", "C++"
]

# Encode Categorial Informationn --predefined
def encode_categorical_features(features: List) -> np.ndarray:
    """
    Encode categorical features (e.g., job roles, availability) into a vector.
    """
    job_role_mapping = {
        "Developer": 0, "Manager": 1, "Designer": 2, "Engineer": 3
    }
    availability_mapping = {
        "immediate": 0, "15 days": 1, "2 months": 2, "summer vacations": 3
    }

    job_roles_encoded = np.zeros(len(job_role_mapping))
    for role in features[0]:
        if role in job_role_mapping:
            job_roles_encoded[job_role_mapping[role]] = 1

    availability_encoded = np.zeros(len(availability_mapping))
    if features[1] in availability_mapping:
        availability_encoded[availability_mapping[features[1]]] = 1

    return np.concatenate([job_roles_encoded, availability_encoded])

