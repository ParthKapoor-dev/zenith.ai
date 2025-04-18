'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatInput, ChatResponse, ChatSession, RankedList } from '@/types/chatbot';

interface ChatSidebarProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    getChatSession: (sessionId: number) => Promise<void>,
    setCurrentSession: React.Dispatch<React.SetStateAction<number | null>>
    setMessages: React.Dispatch<React.SetStateAction<(ChatInput | ChatResponse | RankedList)[]>>
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
    chatSessions: ChatSession[],
    currentSession: number | null
}

export default function ChatSidebar({
    setLoading,
    getChatSession,
    setCurrentSession,
    setMessages,
    textareaRef,
    chatSessions,
    currentSession
}: ChatSidebarProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleOpenSession = async (sessionId: number) => {
        // For desktop, just switch session
        // For mobile, close sheet after switching
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
        setCurrentSession(sessionId)
        setLoading(true);
        await getChatSession(sessionId);
        setLoading(false);
    }

    const startNewChat = () => {
        // For mobile, close sheet after starting new chat
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
        setCurrentSession(null);
        setMessages([]);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    // Mobile Sidebar (Sheet)
    const MobileSidebar = (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden absolute left-2 top-2 z-50"
                >
                    <MenuIcon className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-80 p-0 py-10 bg-gradient-to-bl dark:from-[#0d3647] dark:via-black dark:to-[#000008]"
            >
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
                                    onClick={async () => await handleOpenSession(session.id)}
                                >
                                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                    <div className="truncate text-left">
                                        <div className="font-medium text-sm truncate max-w-60">
                                            {session.title}
                                        </div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex justify-between">
                                            <span>
                                                {session.createdAt.toLocaleDateString()}
                                            </span>
                                            <span>
                                                {session.createdAt.toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    );

    // Desktop Sidebar (Permanent)
    const DesktopSidebar = (
        <div
            className={cn(
                "hidden lg:flex lg:flex-col lg:w-80 lg:border-r dark:bg-purple-100/10 dark: rounded-lg",
            )}
        >
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
                            onClick={async () => await handleOpenSession(session.id)}
                        >
                            <MessageSquare className="w-4 h-4 flex-shrink-0" />
                            <div className="truncate text-left">
                                <div className="font-medium text-sm truncate max-w-60">
                                    {session.title}
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex justify-between">
                                    <span>
                                        {session.createdAt.toLocaleDateString()}
                                    </span>
                                    <span>
                                        {session.createdAt.toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <>
            {MobileSidebar}
            {DesktopSidebar}
        </>
    );
}