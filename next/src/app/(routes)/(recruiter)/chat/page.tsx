'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
    ChevronRight,
    CornerRightDown,
    Loader2,
    Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatArea from '../../../../components/recruiter/chat/ChatArea';
import { ChatInput, ChatResponse, ChatSession, RankedList } from '@/types/chatbot';
import getAllSessions from '@/actions/recruiter/chat/getAllSessions';
import fetchServerAction from '@/lib/fetchHelper';
import User from '@/types/user';
import { useUser } from '@/hooks/useUser';
import handelUserInput from '@/actions/recruiter/chat/handleInput';
import createChatSession from "@/actions/recruiter/chat/createSession";
import getSession from "@/actions/recruiter/chat/getSession";
import Loader from './Loader';
import ChatSidebar from '../../../../components/recruiter/chat/Sidebar';
import getRankedList from '@/actions/recruiter/chat/getRankedList';
import { Button } from '@/components/ui/button';

const MIN_HEIGHT = 64;
const MAX_HEIGHT = 200;

const AIChatInterface = () => {
    const [messages, setMessages] = useState<(ChatInput | ChatResponse | RankedList)[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [currentSession, setCurrentSession] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    //Server Actions
    const getChatSessions = async () =>
        setChatSessions((await fetchServerAction<ChatSession[]>(getAllSessions, []))!);

    const genBotResponse = async (msg: ChatInput) =>
        (await fetchServerAction<string>(() => handelUserInput(msg)))!;

    const createSession = async (title?: string) =>
        (await fetchServerAction<number>(() => createChatSession(title))) as number;

    const getChatSession = async (sessionId: number) =>
        setMessages((await fetchServerAction(() => getSession(sessionId)))!);

    const genRankedList = async (query: string) => {
        const list = await fetchServerAction(() => getRankedList(query, currentSession as number))
        setMessages(prev => [...prev, list])
    }

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height =
                Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT) + 'px';
        }
    }, [inputValue]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);


    useEffect(() => {
        const userInfo = useUser();
        if (userInfo) setUser(userInfo);

        getChatSessions();
    }, [])

    const handleSend = async () => {
        if (!inputValue.trim() || !user?.id) return;

        let sessionId = currentSession;
        if (!sessionId) {
            setLoading(true);
            sessionId = await createSession(inputValue);
            setCurrentSession(sessionId);
            setLoading(false);
        }

        const userMessage: ChatInput = {
            id: genId(),
            sessionId,
            input: inputValue,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        if (messages.length === 0) {
            const newSession: ChatSession = {
                id: genId(),
                title: inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : ''),
                userId: user?.id,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            setChatSessions(prev => [newSession, ...prev]);
            setCurrentSession(newSession.id);
        }

        setIsTyping(true);
        const botResponse = await genBotResponse(userMessage);
        setIsTyping(false);

        const botMessage: ChatResponse = {
            id: genId(),
            sessionId,
            response: botResponse,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
    };


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
    const handleRankedList = async () => {
        setIsLoadingCandidates(true);
        try {
            await genRankedList((messages[messages.length - 2] as ChatInput).input);
        } finally {
            setIsLoadingCandidates(false);
        }
    };

    return (
        <div className="flex inset-0 absolute h-screen pt-[8vh]">
            {loading ? (
                <Loader loadingText='Loading Chat' />
            ) : (
                <div className="flex w-full h-full relative">
                    {/* Sidebar (will now handle both mobile and desktop views) */}
                    <ChatSidebar
                        setLoading={setLoading}
                        getChatSession={getChatSession}
                        setCurrentSession={setCurrentSession}
                        setMessages={setMessages}
                        textareaRef={textareaRef}
                        chatSessions={chatSessions}
                        currentSession={currentSession}
                    />

                    {/* Main Chat Area - Now takes remaining space */}
                    <div className='flex flex-col flex-1'>
                        <ChatArea
                            messages={messages}
                            isTyping={isTyping}
                            chatRef={chatContainerRef}
                            user={user as User}
                        />

                        {/* Input Area with Rank Button */}
                        <div className="p-4">
                            <div className="max-w-3xl mx-auto flex gap-4 items-center">
                                <div className="flex-1 relative">
                                    <Textarea
                                        ref={textareaRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="Send a message..."
                                        className={cn(
                                            "resize-none rounded-lg pr-10 border-zinc-200 dark:border-zinc-700",
                                            "focus:ring-2 focus-visible:ring-lightCyan dark:focus:ring-violet-400",
                                            "bg-white dark:bg-zinc-800",
                                            `min-h-[${MIN_HEIGHT}px]`
                                        )}
                                    />
                                    <CornerRightDown
                                        className={cn(
                                            "absolute right-3 top-3 w-4 h-4 transition-all duration-200",
                                            "text-zinc-400 dark:text-zinc-500",
                                            inputValue ? "opacity-100 scale-100" : "opacity-30 scale-95"
                                        )}
                                    />
                                </div>

                                {messages.length >= 2 && (
                                    <Button
                                        onClick={handleRankedList}
                                        disabled={isLoadingCandidates}
                                        className={cn(
                                            "flex items-center gap-2 bg-darkCyan hover:bg-cyan-600 dark:bg-darkPurple dark:hover:bg-purple-500",
                                            "text-white px-4 py-2 rounded-lg transition-colors",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {isLoadingCandidates ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Loading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Users className="w-4 h-4" />
                                                <span>Find Candidates</span>
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatInterface;


function genId() {
    return Math.floor(Math.random() * 10000)
}




