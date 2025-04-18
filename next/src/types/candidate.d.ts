import { availabilities, currencies, employmentTypes, periods, Role } from "@/db/schema/enum";

export default interface Candidate {
    userId: number,
    resume: string,
    phoneNumber?: string,
    experiences: Experience[],
    projects: Project[],
    education: Education[],
    proficientSkills: string[],
    otherSkills: string[],
    salaryExpectation?: string,
    currencyType?: typeof currencies[number],
    salaryPeriod?: typeof periods[number],
    employmentType?: typeof employmentTypes[number],
    preferredRole?: Role[],
    availability?: typeof availabilities[number],
    isComplete?: boolean,
    updatedAt: Date;
    createdAt: Date;
}

export interface Education {
    id: number,
    instituteName: string;
    courseName: string;
    startDate: string;
    endDate: string;
}


export interface Experience {
    id: number,
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Project {
    id: number,
    projectTitle: string;
    startDate: string;
    endDate: string;
    description: string;
}