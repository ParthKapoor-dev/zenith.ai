import numpy as np
from typing import List, Dict, Optional
from datetime import datetime
from app.services.encoder import embedding_model
from app.models.candidates import Candidate
import logging
# import spacy  # Load NLP Model once at startup

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load NLP Model for Skill Extraction
# try:
#     nlp = spacy.load("en_core_web_sm")  # Replace with a domain-specific model if available
# except Exception as e:
#     logger.error(f"Failed to load NLP model: {e}")
#     raise

# def extract_skills(texts: List[str]) -> List[str]:
#     """
#     Extract skills dynamically using NLP.
#     This replaces the static GLOBAL_SKILL_KEYWORDS approach.
#     """
#     skills = set()
#     for text in texts:
#         try:
#             doc = nlp(text)
#             for token in doc:
#                 if token.ent_type_ == "SKILL":  # Assuming a custom-trained NER model with a "SKILL" entity
#                     skills.add(token.text.lower())
#         except Exception as e:
#             logger.warning(f"Failed to extract skills from text: {e}")
#     return list(skills)

def calculate_years(start_date: Optional[str], end_date: Optional[str]) -> float:
    """Calculate years of experience, assuming ongoing jobs end today."""
    if not start_date:
        return 0.0
    try:
        start = datetime.fromisoformat(start_date.replace("Z", ""))
        end = datetime.fromisoformat(end_date.replace("Z", "")) if end_date else datetime.today()
        return (end - start).days / 365.0
    except Exception as e:
        logger.warning(f"Invalid date format: {e}")
        return 0.0

def vectorize_candidate(candidate_data: Candidate) -> Dict[str, np.ndarray]:
    """
    Convert candidate data into a single vector representation.
    Returns a dictionary with the single vector and metadata.
    """
    try:
        experiences = candidate_data.experiences or []
        projects = candidate_data.projects or []
        education = candidate_data.education or []

        # Combine all relevant information into a single text
        combined_text = []

        # Add skills
        skill_texts = [exp.description for exp in experiences if exp.description] + \
                      [proj.description for proj in projects if proj.description]
        extracted_skills = candidate_data.proficientSkills
        if extracted_skills:
            combined_text.append(f"Skills: {', '.join(extracted_skills)}")

        # Add experience
        for exp in experiences:
            years = calculate_years(exp.startDate, exp.endDate)
            if exp.description:
                combined_text.append(f"{exp.jobTitle} at {exp.companyName} for {years:.1f} years: {exp.description}")

        # Add projects
        for proj in projects:
            if proj.description:
                combined_text.append(f"Project: {proj.projectTitle}: {proj.description}")

        # Add education
        for edu in education:
            year = edu.yearOfPassing if edu.yearOfPassing else "Ongoing"
            combined_text.append(f"Education: {edu.degreeType} from {edu.instituteName}, batch {year}")

        # Combine all text into a single string
        combined_text = " ".join(combined_text)

        # Generate a single vector for the candidate
        candidate_vector = embedding_model.encode(combined_text)

        # Metadata for filtering
        metadata = {
            "salary_expectation": candidate_data.salaryExpectation,
            "employment_type": candidate_data.employmentType,
            "preferred_role": candidate_data.preferredRole,
            "availability": candidate_data.availability,
            "batch_year": education[0].yearOfPassing if education else None,
            "degree_type": education[0].degreeType if education else None,
            "proficient_skills": extracted_skills
        }

        return {
            "candidate_vector": candidate_vector,
            "metadata": metadata
        }
    except Exception as e:
        logger.error(f"Failed to vectorize candidate: {e}")
        raise