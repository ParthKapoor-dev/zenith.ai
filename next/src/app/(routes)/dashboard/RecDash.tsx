'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Plus, Calendar, Building2, BriefcaseIcon, Mails, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types/job';
import fetchServerAction from '@/lib/fetchHelper';
import getAllJobs from '@/actions/recruiter/jobs/getAllJobs';
import routes from '@/lib/routes';


const RecruiterDashboard = () => {

    const [jobs, setJobs] = useState<Job[]>();

    // Server Action
    const fetchAllJobs = async () =>
        setJobs(await fetchServerAction<Job[]>(getAllJobs));
    
    useEffect(() => {
        fetchAllJobs();
    }, [])

    if (!jobs) return (
        <div className='absolute inset-0 flex justify-center items-center text-xl font-semibold'>
            Loading...
        </div>
    )
    
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-8 md:grid-cols-2"
            >
                {/* Action Cards */}
                <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative dark:from-darkPurple ">
                        <CardContent className="p-6">
                            <motion.div
                                className="absolute top-0 right-0 w-32 h-32 opacity-10"
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <Plus className="w-full h-full" />
                            </motion.div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/10 rounded-full">
                                    <BriefcaseIcon className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">Create New Job</h3>
                                    <p className="text-purple-100">Post a new position and find your next team member</p>
                                </div>
                            </div>
                            <Link href={routes.createJobs} className="block mt-4">
                                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50">
                                    Create Job Posting
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* AI Assistant Card */}
                <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative dark:from-lightCyan/30">
                        <CardContent className="p-6">
                            <motion.div
                                className="absolute top-0 right-0 w-32 h-32 opacity-10"
                                animate={{
                                    rotate: -360,
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <MessageSquare className="w-full h-full" />
                            </motion.div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/10 rounded-full">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">AI Chat Assistant</h3>
                                    <p className="text-blue-100">Get instant help with job postings and screening</p>
                                </div>
                            </div>
                            <Link href={routes.chat} className="block mt-4">
                                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                                    Open Chat
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Jobs Overview */}
                <Card className="col-span-2 dark:bg-purple-300/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">Your Job Listings</CardTitle>
                            <p className="text-gray-500 mt-1">
                                {jobs.length} active {jobs.length === 1 ? 'position' : 'positions'}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence>
                            {jobs.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12"
                                >
                                    <div className="mx-auto w-24 h-24 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <AlertCircle className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">No Jobs Posted Yet</h3>
                                    <p className="text-gray-500 mb-4">Start by creating your first job posting</p>
                                    <Link href={routes.createJobs}>
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Your First Job
                                        </Button>
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="grid gap-4"
                                >
                                    {jobs.map((job) => (
                                        <motion.div
                                            key={job.id}
                                            variants={itemVariants}
                                            className="group relative bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                                        >
                                            <Link href={routes.job(job.id)} className="flex items-start justify-between">
                                                <div className="space-y-3">
                                                    <div>
                                                        <h3 className="font-semibold text-xl group-hover:text-blue-600 transition-colors">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Building2 className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-600">{job.companyName}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-3">
                                                        <Badge variant="secondary" className="px-2 py-1">
                                                            {job.salaryRange}
                                                        </Badge>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Mails className="w-4 h-4 mr-1" />
                                                            {job.contactEmail}
                                                        </div>
                                                        {job.contactPhone && (
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Phone className="w-4 h-4 mr-1" />
                                                                {job.contactPhone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                                                    </div>
                                                </div>
                                            </Link>

                                            {job.applicationDeadline && (
                                                <div className="mt-4 text-sm text-gray-500">
                                                    <span className="font-medium">Deadline:</span>{' '}
                                                    {format(new Date(job.applicationDeadline), 'MMMM d, yyyy')}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default RecruiterDashboard;

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};
