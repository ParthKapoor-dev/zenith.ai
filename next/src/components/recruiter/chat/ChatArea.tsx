import { ChatInput, ChatResponse, RankedList } from '@/types/chatbot';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Loader2, User2 } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DisplayList from './DisplayList';
import User from '@/types/user';

interface ChatAreaProps {
    messages: (ChatInput | ChatResponse | RankedList)[];
    isTyping: boolean;
    chatRef: React.RefObject<HTMLDivElement | null>;
    user: User
}
    
export default function ChatArea({ messages, isTyping, chatRef }: ChatAreaProps) {
    return (
        <div className="flex-1 overflow-y-auto scroll-smooth" ref={chatRef}>
            {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <Bot className="w-12 h-12 mx-auto " />
                        <h1 className="text-2xl font-semibold ">
                            Recruitment Assistant
                        </h1>
                        <p className=" max-w-md">
                            I can help you find the perfect candidates for your positions.
                            Start by describing the role you&apos;re looking to fill.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map((message) =>
                            isRankedList(message) ? (
                                <DisplayList rankedList={message} key={message.id + '-list'} />
                            ) : (
                                <motion.div
                                    key={message.id + (isChatInput(message) ? '-input' : '-resp')}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`flex gap-4 ${isChatInput(message) ? 'justify-end' : 'justify-start'}`}
                                >
                                    {/* {!isChatInput(message) && (
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lightCyan dark:bg-purple-900/50 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-darkCyan dark:text-purple-400" />
                                        </div>
                                    )} */}
                                        {/* bg-[#a9cad9] text-[#061117] dark:bg-[#172227] */}
                                    <div
                                        className={`p-4 rounded-lg ${isChatInput(message)
                                            ? ' text-[#061117]  dark:text-white text-lg'
                                            
                                                : 'bg-lightCyan text-darkCyan dark:bg-purple-400/20     dark:text-purple-200 text-lg'
                                            }`} style={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {/* <ReactMarkdown remarkPlugins={[remarkGfm]}> */}
                                        {(message as ChatInput).input || (message as ChatResponse).response}
                                        {/* </ReactMarkdown> */}
                                    </div>
                                    {/* {isChatInput(message) && (
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                                            <User2 className="w-4 h-4 text-white" />
                                        </div>
                                    )} */}
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 justify-start"
                        >
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex gap-1 items-center"
                            >
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm text-purple-500">Thinking...</span>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}

const isChatInput = (message: ChatInput | ChatResponse): message is ChatInput =>
    (message as ChatInput).input !== undefined;

const isRankedList = (message: ChatInput | ChatResponse | RankedList): message is RankedList =>
    (message as RankedList).rankedCandidates !== undefined;