import { availabilities, currencies, employmentTypes, periods, Role } from "@/db/schema/enum";

export default interface Candidate {
    userId: number,
    resume: string,
    phoneNumber?: string,
    experiences: Experience[],
    projects: Project[],
    skills: Skills,
    salaryExpectation?: string,
    currencyType?: typeof currencies,
    salaryPeriod?: typeof periods,
    employmentType?: typeof employmentTypes,
    preferredRole?: Role[],
    availability?: typeof availabilities,
    updatedAt: Date;
    createdAt: Date;
}


export interface Experience {
    id : number,
    job_title: string;
    company_name: string;
    start_date: string;
    end_date: string;
    description: string;
}

export interface Project {
    id: number,
    project_title: string;
    start_date: string;
    end_date: string;
    description: string;
}

export interface Skills {
    proficient: string[];
    other_skills: string[];
}