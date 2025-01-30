// services/ChatService.ts

import { ChatInput, ChatResponse, ChatSession, RankedList } from '@/types/chatbot';
import fetchServerAction from '@/lib/fetchHelper';
import createChatSession from '@/actions/recruiter/chat/createSession';
import getSession from '@/actions/recruiter/chat/getSession';
import getAllSessions from '@/actions/recruiter/chat/getAllSessions';
import getRankedList from '@/actions/recruiter/chat/getRankedList';
import saveChat from '@/actions/recruiter/chat/handleInput';

export class ChatService {
    async getAllSessions(): Promise<ChatSession[]> {
        try {
            const sessions = await fetchServerAction<ChatSession[]>(getAllSessions, []);
            if (!sessions) throw new Error('Failed to fetch chat sessions');
            return sessions;
        } catch (error) {
            console.error('Error fetching chat sessions:', error);
            throw new Error('Failed to fetch chat sessions');
        }
    }

    async createSession(title?: string): Promise<number> {
        try {
            const sessionId = await fetchServerAction<number>(() => createChatSession(title));
            if (!sessionId) throw new Error('Failed to create chat session');
            return sessionId;
        } catch (error) {
            console.error('Error creating chat session:', error);
            throw new Error('Failed to create chat session');
        }
    }
}
    // async getSession(sessionId: number): Promise<(ChatInput | ChatResponse | RankedList)[]> {
    //     try {
    //         const messages = await fetchServerAction(() => getSession(sessionId));
    //         if (!messages) throw new Error('Failed to fetch chat session');
    //         return messages;
    //     } catch (error) {
    //         console.error('Error