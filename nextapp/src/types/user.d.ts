import schema from "@/db/schema"

export type UserRole = 'candidate' | 'recruiter'

export default interface User{
    id: number,
    name : string,
    email : string,
    role : UserRole
}