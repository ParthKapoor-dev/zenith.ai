
export interface ChatResponse {
    id: number;
    sessionId: number,
    response: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface ChatInput {
    id: number;
    sessionId: number,
    input: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface ChatSession {
    id: number;
    userId: number;
    title: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface RankedList {
    id: number,
    rankedCandidates: RankedCandidate[]
    updatedAt: Date,
    createdAt: Date
}

export interface RankedCandidate {
    candidateId: number,
    listId: number,
    score: number,
}