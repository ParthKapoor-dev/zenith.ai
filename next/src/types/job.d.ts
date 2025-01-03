
export interface Job {
    id: string,
    createdBy: number,
    title: string,
    description: string,
    salaryRange: string,
    contactEmail: string,
    companyName: string,
    applicationDeadline?: Date,
    contactPhone?: string,
    updatedAt: Date;
    createdAt: Date;
}


export interface JobApplication {
    applicantId: number,
    jobId: string,
    updatedAt: Date;
    createdAt: Date;
}