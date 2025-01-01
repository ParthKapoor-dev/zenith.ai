import numpy as np
from typing import List, Dict
from datetime import datetime
from app.services.encoder import encode_categorical_features , GLOBAL_SKILL_KEYWORDS , embedding_model
from app.models.candidates import Candidate, Experience, Project


def extract_skills_with_experience(experiences: List[Experience], projects: List[Project], skill_keywords: List[str]) -> Dict[str, float]:
    """
    Dynamically extract skills from experiences and projects and map them to their respective durations.
    """
    skill_experience_map = {skill.lower(): 0.0 for skill in skill_keywords}  # Initialize skill duration map (all in lowercase)

    # Extract from experiences
    for exp in experiences:
        duration = calculate_years(exp.startDate, exp.endDate)
        description = exp.description.lower()
        for skill in skill_keywords:
            if skill.lower() in description:
                skill_experience_map[skill.lower()] += duration

    # Extract from projects
    for proj in projects:
        duration = calculate_years(proj.startDate, proj.endDate)
        description = proj.description.lower()
        for skill in skill_keywords:
            if skill.lower() in description:
                skill_experience_map[skill.lower()] += duration  

    # Remove skills with no associated experience
    skill_experience_map = {skill: exp for skill, exp in skill_experience_map.items() if exp > 0}
    return skill_experience_map

def vectorize_candidate(candidate_data : Candidate) -> np.ndarray:
    """
    Convert candidate data into a unified vector representation, including domain-specific experience.
    """
    # Extract text embeddings (general profile vector)
    experiences = candidate_data.experiences
    projects = candidate_data.projects
    experience_descriptions = [exp.description for exp in experiences]
    project_descriptions = [proj.description for proj in projects]
    all_descriptions = experience_descriptions + project_descriptions
    text_feature_vector = np.mean(embedding_model.encode(all_descriptions), axis=0)

    # Extract skill-specific experience
    skill_experience_map = extract_skills_with_experience(experiences, projects, GLOBAL_SKILL_KEYWORDS)

    # Encode skill experience as a fixed-size vector (e.g., by ordering skills alphabetically)
    skill_vector = np.zeros(len(GLOBAL_SKILL_KEYWORDS))
    for idx, skill in enumerate(GLOBAL_SKILL_KEYWORDS):
        skill_vector[idx] = skill_experience_map.get(skill.lower(), 0.0)  # Ensure key is lowercase

    # Numerical Features (e.g., total experience, minimum salary)
    total_experience = sum(
        calculate_years(exp.startDate, exp.endDate) for exp in experiences
    )
    # Convert salaryExpectation to float for calculation
    min_salary = float(candidate_data.salaryExpectation) / 100000.0  # Normalize salary

    # Categorical Features
    job_roles = candidate_data.preferredRole
    availability = candidate_data.availability
    categorical_vector = encode_categorical_features([job_roles, availability])

    # Combine all features into a single vector
    candidate_vector = np.concatenate([text_feature_vector, skill_vector, [total_experience, min_salary], categorical_vector])
    return candidate_vector

# Helper function to calculate years between two dates
def calculate_years(start_date: str, end_date: str) -> float:
    if not start_date or not end_date:
        return 0.0
    # Convert ISO format date strings to datetime objects
    start = datetime.fromisoformat(start_date.replace("Z", ""))  # Remove 'Z' for ISO format compatibility
    end = datetime.fromisoformat(end_date.replace("Z", ""))
    return (end - start).days / 365.0


