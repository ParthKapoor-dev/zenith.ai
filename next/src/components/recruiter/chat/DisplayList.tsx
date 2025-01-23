'use client'

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RankedList, RankedCandidate } from '@/types/chatbot';
import { ChevronRight } from 'lucide-react';
import Candidate from '@/types/candidate';
import User from '@/types/user';

interface cand extends Candidate {
    user: User
}

interface rankedCands extends RankedCandidate{
    candidate: cand
}

export default function DisplayList({ rankedList }: { rankedList: RankedList }) {

    const cands = rankedList.rankedCandidates as rankedCands[]
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-zinc-200 dark:border-zinc-700 max-w-3xl mx-auto w-full "
        >
            <Card className="m-4 bg-white dark:bg-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Top Candidates
                    </CardTitle>
                    <CardDescription>
                        Based on your requirements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {cands.map((data, index) => (
                            <motion.div
                                key={data.candidateId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                                    <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medpium">{data.candidate.user.name}</h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{data.candidate.user.email}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-zinc-400" />
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}