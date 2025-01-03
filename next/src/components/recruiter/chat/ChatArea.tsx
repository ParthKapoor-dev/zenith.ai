import { ChatInput, ChatResponse } from '@/types/chatbot';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Loader2, User2 } from 'lucide-react';

interface ChatAreaProps {
    messages: (ChatInput | ChatResponse)[]
    isTyping: boolean
}

export default function ChatArea({ messages, isTyping }: ChatAreaProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <Bot className="w-12 h-12 mx-auto text-zinc-400" />
                        <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                            Recruitment Assistant
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
                            I can help you find the perfect candidates for your positions.
                            Start by describing the role you're looking to fill.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id + (isChatInput(message) ? '-input' : '-resp') }
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex gap-4"
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                                            ${(message as ChatInput).input
                                        ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400'
                                        : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                                    }`}
                                >
                                    {(message as ChatInput).input ? (
                                        <User2 className="w-4 h-4" />
                                    ) : (
                                        <Bot className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1 prose prose-zinc dark:prose-invert max-w-none">
                                    {(message as ChatInput).input || (message as ChatResponse).response}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex gap-1 items-center"
                            >
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm text-zinc-500">Thinking...</span>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>

    )
}


function isChatInput(message: ChatInput | ChatResponse): message is ChatInput {
    return (message as ChatInput).input !== undefined
}
