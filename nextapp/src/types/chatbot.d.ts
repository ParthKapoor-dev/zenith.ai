
export interface ChatMessage {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    id: string;
    title: string;
    timestamp: Date;
}
