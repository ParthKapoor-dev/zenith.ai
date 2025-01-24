'use client'

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RankedList, RankedCandidate } from '@/types/chatbot';
import { ChevronRight } from 'lucide-react';
import Candidate from '@/types/candidate';
import User from '@/types/user';
import { ExpandableCard } from '@/components/ui/expandable-card';

interface cand extends Candidate {
    user: User
}

interface rankedCands extends RankedCandidate{
    candidate: cand
}

export default function DisplayList({ rankedList }: { rankedList: RankedList }) {
    const cands = rankedList.rankedCandidates as rankedCands[];
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-zinc-200 dark:border-zinc-700 max-w-3xl mx-auto w-full"
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
                    <div className="">
                        {cands.map((data, index) => (
                            <ExpandableCard key={index} cards={[data]} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}