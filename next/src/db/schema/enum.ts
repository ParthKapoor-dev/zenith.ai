
export const userRoles = ['recruiter', 'candidate'] as const

export const currencies = [
    'USD',
    'EUR',
    'GBP',
    'INR',
    'JPY',
] as const

export const periods = [
    'annual',
    'monthly'
] as const

export const employmentTypes = [
    "Full Time",
    "Part Time",
    "Internship",
    "Freelance",
    "Contract"
] as const;

export const roles = [
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Security Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Data Engineer",
    "Data Analyst",
    "Business Intelligence Analyst",
    "UI Designer",
    "UX Designer",
    "Product Designer",
    "Graphics Designer",
    "Product Manager",
    "Project Manager",
    "Technical Lead",
    "Engineering Manager"

] as const

export type Role = (typeof roles)[number]; // Restrict to valid roles

export const availabilities = [
    "immediate",
    "15days",
    "1month",
    "2months",
    "3months",
    "summer",
] as const