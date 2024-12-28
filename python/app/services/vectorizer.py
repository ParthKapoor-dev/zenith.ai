import numpy as np
from app.services.encoder import encode_categorical_features , GLOBAL_SKILL_KEYWORDS , embedding_model
from typing import List, Dict
from datetime import datetime


def extract_skills_with_experience(experiences: List[Dict], projects: List[Dict], skill_keywords: List[str]) -> Dict[str, float]:
    """
    Dynamically extract skills from experiences and projects and map them to their respective durations.
    """
    skill_experience_map = {skill: 0.0 for skill in skill_keywords}  # Initialize skill duration map

    # Extract from experiences
    for exp in experiences:
        duration = calculate_years(exp.get("start_date"), exp.get("end_date"))
        description = exp.get("description", "").lower()
        for skill in skill_keywords:
            if skill.lower() in description:
                skill_experience_map[skill] += duration

    # Extract from projects
    for proj in projects:
        duration = calculate_years(proj.get("start_date"), proj.get("end_date"))
        description = proj.get("description", "").lower()
        for skill in skill_keywords:
            if skill.lower() in description:
                skill_experience_map[skill] += duration

    # Remove skills with no associated experience
    skill_experience_map = {skill: exp for skill, exp in skill_experience_map.items() if exp > 0}
    return skill_experience_map

def vectorize_candidate(candidate_data: Dict) -> np.ndarray:
    """
    Convert candidate data into a unified vector representation, including domain-specific experience.
    """
    # Extract text embeddings (general profile vector)
    experiences = candidate_data.get("experiences", [])
    projects = candidate_data.get("projects", [])
    experience_descriptions = [exp["description"] for exp in experiences]
    project_descriptions = [proj["description"] for proj in projects]
    all_descriptions = experience_descriptions + project_descriptions
    text_feature_vector = np.mean(embedding_model.encode(all_descriptions), axis=0)

    # Extract skill-specific experience
    skill_experience_map = extract_skills_with_experience(experiences, projects, GLOBAL_SKILL_KEYWORDS)

    # Encode skill experience as a fixed-size vector (e.g., by ordering skills alphabetically)
    skill_vector = np.zeros(len(GLOBAL_SKILL_KEYWORDS))
    for idx, skill in enumerate(GLOBAL_SKILL_KEYWORDS):
        skill_vector[idx] = skill_experience_map.get(skill, 0.0)

    # Numerical Features (e.g., total experience, minimum salary)
    total_experience = sum(
        calculate_years(exp.get("start_date"), exp.get("end_date")) for exp in experiences
    )
    min_salary = candidate_data.get("min_salary", 0) / 100000.0  # Normalize salary

    # Categorical Features
    job_roles = candidate_data.get("preferred_job_roles", [])
    availability = candidate_data.get("availability", "immediate")
    categorical_vector = encode_categorical_features([job_roles, availability])

    # Combine all features into a single vector
    candidate_vector = np.concatenate([text_feature_vector, skill_vector, [total_experience, min_salary], categorical_vector])
    return candidate_vector

# Helper function to calculate years between two dates
def calculate_years(start_date: str, end_date: str) -> float:
    if not start_date or not end_date:
        return 0.0
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    return (end - start).days / 365.0