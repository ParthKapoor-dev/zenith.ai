'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Calendar,
    MapPin,
    Clock,
    Ban
} from 'lucide-react';
import { cn } from "@/lib/utils";
import fetchServerAction from '@/lib/fetchHelper';
import getAppliedJobs, { ActionResponse } from '@/actions/candidate/application/getAppliedJobs';
import { formatDate } from '@/lib/formatDates';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';

export default function AppliedJobs() {

    const [appliedJobs, setJobs] = useState<ActionResponse>([]);
    const router = useRouter();

    //server action
    const fetchAppliedJobs = async () =>
        setJobs(await fetchServerAction(getAppliedJobs))

    useEffect(() => {
        fetchAppliedJobs();
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "w-full max-w-3xl mx-auto",
                "bg-white dark:bg-zinc-900/70",
                "border border-zinc-100 dark:border-zinc-800",
                "rounded-3xl shadow-xl backdrop-blur-xl"
            )}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 flex flex-col gap-2">
                        Applied Jobs
                        <p className="text-sm text-zinc-600 dark:text-zinc-500">
                            {appliedJobs.length} Applications
                        </p>
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-500">
                            Last 30 Days
                        </span>
                    </div>
                </div>

                {appliedJobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <Ban className="w-16 h-16 text-zinc-400 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                            No Applications Yet
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-sm">
                            You haven't applied to any jobs yet. Start exploring opportunities and submit your first application!
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {appliedJobs.map(({ jobs, jobApplications }, index) => (
                            <motion.div
                                key={jobs.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => router.push(routes.application(jobs.id))}
                                className={cn(
                                    "group relative flex items-start gap-4",
                                    "p-4 -mx-3 rounded-2xl",
                                    "transition-all duration-300 ease-out",
                                    "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                                    "hover:shadow-sm",
                                    "border border-transparent",
                                    "hover:border-zinc-200 dark:hover:border-zinc-700/50"
                                )}
                            >
                                <div
                                    className={cn(
                                        "relative",
                                        "w-12 h-12 flex items-center justify-center",
                                        "rounded-2xl",
                                        "bg-gradient-to-br",
                                        "from-blue-600/10 via-blue-600/5 to-blue-600/0 text-blue-700 dark:from-blue-500/20 dark:via-blue-500/10 dark:to-transparent dark:text-blue-400",
                                        "transition-all duration-300",
                                        "group-hover:scale-105",
                                        "group-hover:shadow-md",
                                        "border border-zinc-200/50 dark:border-zinc-700/50"
                                    )}
                                >
                                    <Building2 className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                            {jobs.title}
                                        </h3>
                                        <span className={cn(
                                            "text-sm font-medium px-3 py-1 rounded-full from-blue-600/10 via-blue-600/5 to-blue-600/0 text-blue-700 dark:from-blue-500/20 dark:via-blue-500/10 dark:to-transparent dark:text-blue-400"
                                        )}>
                                            Application Submitted
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            {jobs.companyName}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {jobs.contactEmail}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {jobs.contactPhone}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Applied {formatDate(jobApplications.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {
                appliedJobs.length > 0 && (
                    <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            type="button"
                            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium
              text-zinc-700 dark:text-zinc-400 
              hover:bg-zinc-50 dark:hover:bg-zinc-800
              transition-colors duration-200"
                        >
                            View All Applications
                        </button>
                    </div>
                )
            }
        </motion.div >
    );
}