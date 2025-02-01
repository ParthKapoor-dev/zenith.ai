from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date

# Candidate Model
from pydantic import BaseModel
from typing import List, Optional

# Experience Model
class Experience(BaseModel):
    id: Optional[int] = Field(None, description="Primary key")
    userId: int = Field(..., description="Foreign key referencing Candidates table")
    jobTitle: str = Field(..., max_length=255, description="Job title of the experience")
    companyName: str = Field(..., max_length=255, description="Company name of the experience")
    startDate: date = Field(..., description="Start date of the experience")
    endDate: Optional[date] = Field(None, description="End date of the experience")
    description: Optional[str] = Field(None, description="Description of the experience")

# Education Model
class Education(BaseModel):
    id: Optional[int] = Field(None, description="Primary key")
    userId: int = Field(..., description="Foreign key referencing Candidates table")
    courseName: str = Field(..., max_length=255, description="Name of the course")
    instituteName: str = Field(..., max_length=255, description="Name of the institute")
    startDate: date = Field(..., description="Start date of the education")
    endDate: Optional[date] = Field(None, description="End date of the education")

# Project Model
class Project(BaseModel):
    id: Optional[int] = Field(None, description="Primary key")
    userId: int = Field(..., description="Foreign key referencing Candidates table")
    projectTitle: str = Field(..., max_length=255, description="Title of the project")
    startDate: date = Field(..., description="Start date of the project")
    endDate: Optional[date] = Field(None, description="End date of the project")
    description: Optional[str] = Field(None, description="Description of the project")

class Candidate(BaseModel):
    userId: int
    resume: str
    phoneNumber: Optional[str]
    salaryExpectation: str
    currencyType: str
    salaryPeriod: str
    employmentType: Optional[str]
    preferredRole: List[str]  # Ensure it's a List[str]
    availability: str
    proficientSkills: List[str]  # Ensure it's a List[str]
    otherSkills: List[str]  # Ensure it's a List[str]
    isComplete: bool
    experiences: List[Experience]
    projects: List[Project]
    education: List[Education]
    updatedAt: str  # Will fix below
    createdAt: str  # Will fix below
