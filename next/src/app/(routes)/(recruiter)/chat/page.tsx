'use client'

import React, { useState, useRef, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    MenuIcon,
    Plus,
    MessageSquare,
    CornerRightDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@/components/ui/dialog';
import ChatArea from '../../../../components/recruiter/chat/ChatArea';
import { ChatInput, ChatResponse, ChatSession } from '@/types/chatbot';
import getAllSessions from '@/actions/recruiter/chat/getAllSessions';
import fetchServerAction from '@/lib/fetchHelper';
import User from '@/types/user';
import { useUser } from '@/hooks/useUser';
import handelUserInput from '@/actions/recruiter/chat/handleInput';
import createChatSession from "@/actions/recruiter/chat/createSession";
import getSession from "@/actions/recruiter/chat/getSession";
import Loader from './Loader';
import ChatSidebar from '../../../../components/recruiter/chat/Sidebar';


const MIN_HEIGHT = 64;
const MAX_HEIGHT = 200;

const AIChatInterface = () => {
    const [messages, setMessages] = useState<(ChatInput | ChatResponse)[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [currentSession, setCurrentSession] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [user, setUser] = useState<User | null>(null);

    //Server Actions
    const getChatSessions = async () =>
        setChatSessions((await fetchServerAction<ChatSession[]>(getAllSessions, []))!);

    const genBotResponse = async (msg: ChatInput) =>
        (await fetchServerAction<string>(() => handelUserInput(msg)))!;

    const createSession = async (title?: string) => {
        const sessionId = (await fetchServerAction<number>(() => createChatSession(title)))!;
        setCurrentSession(sessionId);
        return sessionId;
    }

    const getChatSession = async (sessionId: number) =>
        setMessages((await fetchServerAction(() => getSession(sessionId)))!);

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
        console.log("ALL CHAT MESSAGES ", messages);
    }, [messages])

    useEffect(() => {
        console.log("ALL CHAT SESSIONS ", chatSessions);
    }, [chatSessions])

    useEffect(() => {
        console.log("CURRENT SESSION ", currentSession);
    }, [currentSession])


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
        const botResponse = await genBotResponse(userMessage)!;
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


    return (
        <div className="flex h-[80vh] relative">
            {/* Sidebar for both Mobile and Desktop */}
            <ChatSidebar
                setLoading={setLoading}
                getChatSession={getChatSession}
                setCurrentSession={setCurrentSession}
                setMessages={setMessages}
                textareaRef={textareaRef}
                chatSessions={chatSessions}
                currentSession={currentSession}
            />

            {/* Main Chat Area */}
            {loading
                ? <Loader loadingText='Loading Chat' />
                : (<div className="flex-1 flex flex-col h-full relative pt-16">

                    <ChatArea messages={messages} isTyping={isTyping} />

                    {/* Enhanced Input Area */}
                    <div className="">
                        <div className="max-w-3xl mx-auto p-4">
                            <div className="relative border border-black/10 dark:border-white/10 focus-within:border-black/20 dark:focus-within:border-white/20 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03]">
                                <div className="flex flex-col">
                                    <div className="overflow-y-auto">
                                        <Textarea
                                            ref={textareaRef}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Send a message..."
                                            className={cn(
                                                "max-w-full rounded-2xl pr-10 pt-3 pb-3 placeholder:text-black/70 dark:placeholder:text-white/70 border-none text-black dark:text-white resize-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 leading-[1.2]",
                                                `min-h-[${MIN_HEIGHT}px]`
                                            )}
                                        />
                                    </div>
                                </div>

                                <CornerRightDown
                                    className={cn(
                                        "absolute right-3 top-3 w-4 h-4 transition-all duration-200 dark:text-white",
                                        inputValue ? "opacity-100 scale-100" : "opacity-30 scale-95"
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>)}
        </div>
    );
};

export default AIChatInterface;


function genId() {
    return Math.floor(Math.random() * 10000)
}




