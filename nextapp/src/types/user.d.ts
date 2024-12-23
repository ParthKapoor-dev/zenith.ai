
export type UserRole = 'candidate' | 'recruiter'

export default interface User {
    id: number,
    name: string,
    email: string,
    role: UserRole,
    image: string | null
}