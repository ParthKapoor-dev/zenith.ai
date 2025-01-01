from typing import List, Optional
from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime

# Pydantic Models
class Experience(BaseModel):
    id: int
    userId: int
    jobTitle: str
    companyName: str
    startDate: str
    endDate: Optional[str]  # Optional if not provided
    description: Optional[str] = None

class Project(BaseModel):
    id: int
    userId: int
    projectTitle: str
    startDate: str
    endDate: Optional[str]
    description: Optional[str] = None

class Candidate(BaseModel):
    userId: int
    resume: HttpUrl
    phoneNumber: Optional[str]
    salaryExpectation: int = Field(..., ge=0)  # Salary should be non-negative
    currencyType: str
    salaryPeriod: str
    employmentType: str
    preferredRole: List[str]
    availability: str
    proficientSkills: List[str]
    otherSkills: List[str]
    isComplete: bool
    updatedAt: datetime
    createdAt: datetime
    experiences: List[Experience]
    projects: List[Project]
