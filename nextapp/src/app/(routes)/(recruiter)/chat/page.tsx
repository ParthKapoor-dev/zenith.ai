'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    MenuIcon,
    Send,
    Bot,
    User2,
    Loader2,
    Plus,
    MessageSquare,
    CornerRightDown,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@/components/ui/dialog';
import ChatArea from './ChatArea';
import { ChatMessage, ChatSession } from '@/types/chatbot';


const MIN_HEIGHT = 64;
const MAX_HEIGHT = 200;

const AIChatInterface = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [currentSession, setCurrentSession] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height =
                Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT) + 'px';
        }
    }, [inputValue]);

    const generateBotResponse = async (userInput: string) => {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTyping(false);
        return "I'll help you find the perfect candidates for this position. Could you please provide more details about the required skills and experience?";
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        if (messages.length === 0) {
            const newSession: ChatSession = {
                id: Date.now().toString(),
                title: inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : ''),
                timestamp: new Date(),
            };
            setChatSessions(prev => [newSession, ...prev]);
            setCurrentSession(newSession.id);
        }

        const botResponse = await generateBotResponse(inputValue);
        const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: botResponse,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
    };

    const startNewChat = () => {
        setMessages([]);
        setCurrentSession(null);
        setIsSidebarOpen(false);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
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
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-2 z-50"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="left"
                    className="w-80 p-0"
                >
                    <DialogTitle />
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                            <Button
                                onClick={startNewChat}
                                className="w-full justify-start gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                New Chat
                            </Button>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="space-y-2 p-2">
                                {chatSessions.map((session) => (
                                    <Button
                                        key={session.id}
                                        variant={currentSession === session.id ? "secondary" : "ghost"}
                                        className="w-full justify-start gap-2 h-auto py-3"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                        <div className="truncate text-left">
                                            <div className="font-medium text-sm truncate">
                                                {session.title}
                                            </div>
                                            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                                {session.timestamp.toLocaleDateString()}
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative pt-16">

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
            </div>
        </div>
    );
};

export default AIChatInterface;