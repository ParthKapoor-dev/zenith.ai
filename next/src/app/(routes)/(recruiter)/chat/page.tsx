"use client";

import React, { useState, useRef, useEffect } from "react";
import { CornerRightDown, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";

import ChatArea from "@/components/recruiter/chat/ChatArea";
import { Textarea } from "@/components/ui/textarea";
import ChatSidebar from "@/components/recruiter/chat/Sidebar";
import { Button } from "@/components/ui/button";

import {
  ChatInput,
  ChatResponse,
  ChatSession,
  RankedList,
} from "@/types/chatbot";
import User from "@/types/user";

import {
  createChatSession,
  getSession,
  getAllSessions,
  getRankedList,
  saveChat,
} from "@/actions/recruiter/chat";
import Loader from "./Loader";
import fetchServerAction from "@/lib/fetchHelper";
import StructuredDataPanel from "@/components/recruiter/chat/DisplayQuery";
import updateData from "@/actions/recruiter/chat/updateData";

// Constants
const MIN_HEIGHT = 64;
const MAX_HEIGHT = 200;
const SOCKET_URL = process.env.NEXT_PUBLIC_CHATBOT_BACKEND + "/chat";
const RECONNECT_DELAY = 3000;
const MAX_RETRIES = 3;

interface WebSocketMessage {
  type: "init" | "chat";
  sessionId?: number;
  messages?: Array<ChatInput | ChatResponse | RankedList>;
  message?: string;
}

interface BotResponse {
  text: string;
  done?: string;
  error?: string;
  structured_data?: Record<string, any>;
  summarized_chat?: string;
}

const AIChatInterface = () => {
  // State Management
  const [messages, setMessages] = useState<
    (ChatInput | ChatResponse | RankedList)[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<number | null>(null);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [socketRetries, setSocketRetries] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [structuredData, setStructuredData] = useState<Record<
    string,
    any
  > | null>(null);
  const [summarizedQuery, setSummarizedQuery] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  const socketRef = useRef<WebSocket | null>(null);

  // Error Handler
  const handleError = (error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    toast({
      title: "Error",
      description: `An error occurred in ${context}. Please try again.`,
      variant: "destructive",
    });
  };

  // Server Actions with Error Handling
  const getChatSessions = async () =>
    setChatSessions(await fetchServerAction(getAllSessions));

  const handleSaveChat = async (inp: ChatInput, resp: ChatResponse) =>
    await fetchServerAction(() => saveChat(inp, resp));

  const createSession = async (title?: string) =>
    await fetchServerAction(async () => {
      const sessionId = await createChatSession(title);
      if (sessionId && socketRef.current)
        socketRef.current.send(
          JSON.stringify({ type: "init", sessionId, messages: [] })
        );
      return sessionId;
    });

  const getChatSession = async (sessionId: number) =>
    await fetchServerAction(async () => {
      const { msgs, data } = await getSession(sessionId);
      setMessages(msgs);
      setStructuredData({
        preferred_skills: data?.preferred_skills,
        experience_level: data?.experience_level,
        salary_expectations: data?.salary_expectations,
        employment_type: data?.employment_type,
        current_job_status: data?.current_job_status,
        job_responsibilities: data?.job_responsibilities,
      });
      setSummarizedQuery(data?.query ? data.query : null);
      socketRef.current?.send(
        JSON.stringify({
          type: "init",
          sessionId: currentSession,
          messages: msgs,
        })
      );
    });

  const genRankedList = async () =>
    await fetchServerAction(async () => {
      const list = await getRankedList(
        summarizedQuery || "",
        structuredData,
        currentSession!
      );
      setMessages((prev) => [...prev, list]);
    });

  const updateChatData = async (data: any | null, query: string | null) =>
    await fetchServerAction(() => updateData(currentSession!, data, query));

  // WebSocket Connection Management
  const connectSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;
    if (socketRef.current) socketRef.current.close();

    console.log("Current Socket", socketRef.current);

    try {
      const newSocket = new WebSocket(SOCKET_URL);
      socketRef.current = newSocket;

      newSocket.onopen = handleSocketOpen;
      newSocket.onclose = handleSocketClose;
      newSocket.onerror = handleSocketError;
      newSocket.onmessage = handleSocketMessage;
    } catch (error) {
      handleError(error as Error, "connecting to WebSocket");
    }
  };

  const handleSocketOpen = () => {
    console.log("WebSocket connected");
    if (!socketRef.current) return;
    setSocketRetries(0);
    toast({
      title: "Connected",
      description: "You are now live to chat with Zenith",
    });
    socketRef.current?.send(
      JSON.stringify({
        type: "init",
        sessionId: currentSession,
        messages,
      })
    );
  };

  const handleSocketClose = (event: CloseEvent) => {
    console.log("WebSocket disconnected", event);

    if (!event.wasClean && socketRetries < MAX_RETRIES) {
      console.log("Disconnection isn't clean");
      setTimeout(() => {
        if (!socketRef.current || socketRef.current.readyState > 1) {
          setSocketRetries((prev) => prev + 1);
          connectSocket();
        }
      }, RECONNECT_DELAY);
    } else if (socketRetries >= MAX_RETRIES) {
      toast({
        title: "Connection Error",
        description:
          "Failed to re-establish connection. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const handleSocketError = (error: Event) => {
    console.log("The Real Error", error);
    // handleError(new Error(), "WebSocket connection");
  };

  const handleSocketMessage = async (event: MessageEvent) => {
    try {
      const data: BotResponse = JSON.parse(event.data);
      if (!data) return;

      setIsTyping(false);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.structured_data) {
        console.log(data.structured_data);
        setStructuredData(data.structured_data.properties);
        setIsPanelOpen(true);
        if (data.structured_data)
          await updateChatData(data.structured_data.properties, null);
      }

      if (data.summarized_chat) {
        const query = data.summarized_chat
          ?.split('**Query:** "')[1]
          ?.split('"')[0];
        console.log(query);
        setSummarizedQuery(query);
        setIsPanelOpen(true);
        if (query) await updateChatData(null, query);
      }

      if (data.text) {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1] as ChatResponse;
          if (lastMsg?.sessionId === currentSession) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMsg,
                response: lastMsg.response + data.text,
              },
            ];
          }
          return [
            ...prev,
            {
              id: generateId(),
              sessionId: currentSession!,
              response: data.text,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];
        });
      }

      if (data.done) {
        const msgs = messagesRef.current;
        await handleSaveChat(
          msgs[msgs.length - 2] as ChatInput,
          msgs[msgs.length - 1] as ChatResponse
        );
      }
    } catch (error) {
      handleError(error as Error, "processing bot response");
    }
  };

  // Effects
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const userInfo = useUser();
    if (userInfo) setUser(userInfo);

    getChatSessions();
    connectSocket();

    return () => {
      console.log("**********Return TRIGGERED", socketRef.current);
      if (socketRef.current?.readyState === WebSocket.OPEN)
        console.log("Triggered Close")
        socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height =
        Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT) + "px";
    }
  }, [inputValue]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Event Handlers
  const handleSend = async () => {
    try {
      if (!inputValue.trim() || !user?.id) return;

      if (!socketRef.current) connectSocket();

      let sessionId = currentSession;
      if (!sessionId) {
        setLoading(true);
        sessionId = await createSession(inputValue);
        if (!sessionId) throw new Error("Failed to create session");
        setCurrentSession(sessionId);
        setLoading(false);
      }

      const userMessage: ChatInput = {
        id: generateId(),
        sessionId,
        input: inputValue,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");

      setIsTyping(true);
      socketRef.current?.send(
        JSON.stringify({
          type: "chat",
          message: userMessage.input,
        })
      );
    } catch (error) {
      handleError(error as Error, "sending message");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRankedList = async () => {
    setIsLoadingCandidates(true);
    await genRankedList();
    setIsLoadingCandidates(false);
  };

  // Render
  if (loading) {
    return <Loader loadingText="Loading Chat" />;
  }

  return (
    <div className="flex inset-0 absolute h-screen pt-[8vh]">
      <div className="flex w-full h-full relative">
        <ChatSidebar
          setLoading={setLoading}
          getChatSession={getChatSession}
          setCurrentSession={setCurrentSession}
          setMessages={setMessages}
          textareaRef={textareaRef}
          chatSessions={chatSessions}
          currentSession={currentSession}
        />

        <div className="flex flex-col flex-1">
          <ChatArea
            messages={messages}
            isTyping={isTyping}
            chatRef={chatContainerRef}
            user={user as User}
          />

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

        {structuredData && (
          <StructuredDataPanel
            data={structuredData}
            query={summarizedQuery}
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AIChatInterface;

// Utility Functions
const generateId = () => Math.floor(Math.random() * 10000);
