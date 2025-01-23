'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Users, Clock, Calendar, Mail, Phone, Building2, DollarSign, MessageSquare, AlertCircle, User, Share2, Check, Copy, ExternalLink } from 'lucide-react';
import fetchServerAction from '@/lib/fetchHelper';
import getJobDetails from '@/actions/recruiter/jobs/getJobDetails';
import { Job } from '@/types/job';
import { toast } from '@/hooks/use-toast';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShineBorder } from '@/components/ui/shine-border';

interface QueryResponse {
    indivCount: {
        date: unknown;
        count: unknown;
    }[];
    job: Job;
}

interface JobDetailsProps extends Job {
    totalCount: number,
    dailyCount: {
        date: unknown,
        count: unknown
    }[]
}

const ShareLinkCard = ({ jobId }: { jobId: string }) => {
    const [copied, setCopied] = useState(false);
    const applicationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/apply/${jobId}`;

    const copyLink = async () => {
        await navigator.clipboard.writeText(applicationLink);
        setCopied(true);
        toast({
            title: "Link copied!",
            description: "The application link has been copied to your clipboard."
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ShineBorder className='w-full p-0 rounded-xl' color={["#FE8FB5", "#FFBE7B", "#FFBE7B"]}>
            <Card className="shadow-lg border-2 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-blue-400/20 dark:to-cyan-200/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-violet-600" />
                        Share Job Application
                    </CardTitle>
                    <CardDescription>
                        Share this link with potential candidates
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={applicationLink}
                            readOnly
                            className="bg-white dark:bg-zinc-800"
                        />
                        <Button
                            onClick={copyLink}
                            variant="outline"
                            className="min-w-[100px]"
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-green-600" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                            <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {['LinkedIn', 'Twitter', 'Email'].map((platform) => (
                            <Button
                                key={platform}
                                variant="outline"
                                className="flex-1 bg-black/80"
                                onClick={() => {
                                    const text = `We're hiring! Check out this position: ${applicationLink}`;
                                    let url = '';
                                    switch (platform) {
                                        case 'LinkedIn':
                                            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(applicationLink)}`;
                                            break;
                                        case 'Twitter':
                                            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                                            break;
                                        case 'Email':
                                            url = `mailto:?subject=Job Opportunity&body=${encodeURIComponent(text)}`;
                                            break;
                                    }
                                    window.open(url, '_blank');
                                }}
                            >
                                {platform}
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </ShineBorder>
    );
};


const JobAnalyticsDashboard = ({ params }: { params: Promise<{ slug: string }> }) => {
    const [jobDetails, setJobDetails] = useState<JobDetailsProps>();
    const [error, setError] = useState<boolean>(false);

    const getCurrentData = async () => {
        const resp: QueryResponse = await fetchServerAction<QueryResponse>(
            async () => getJobDetails((await params).slug),
            null,
            () => setError(true)
        );

        setJobDetails({
            ...resp.job,
            totalCount: resp.indivCount.reduce((acc, val) => acc + +(val.count || 0), 0),
            dailyCount: resp.indivCount
        });
    };

    useEffect(() => {
        getCurrentData();
    }, []);

    if (error) return <ErrorScreen />;
    if (!jobDetails) return <LoadingScreen />;

    const handleAIAnalytics = () => {
        toast({
            title: "Comming Soon!"
        })
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold dark:text-gray-300">
                            Job Analytics Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Tracking recruitment progress for {jobDetails.title}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            className="bg-violet-600 hover:bg-violet-700"
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat Now
                        </Button>
                        <Button
                            onClick={handleAIAnalytics}
                            variant="outline"
                            className="border-violet-200 text-violet-600 hover:bg-violet-50"
                        >
                            <Brain className="mr-2 h-4 w-4" />
                            AI Insights
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-6">
                        <ShareLinkCard jobId={jobDetails.id} />

                        <Card className="shadow-md border border-violet-100 dark:border-zinc-800 bg-white dark:bg-purple-100/10">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl font-bold ">{jobDetails.title}</CardTitle>
                                        <CardDescription className="text-gray-500 mt-1">{jobDetails.companyName}</CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="bg-violet-100 text-violet-600">
                                        {jobDetails.totalCount} Applications
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {jobDetails.dailyCount.length ? (
                                    <div className="h-72 mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={jobDetails.dailyCount}>
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line
                                                    type="monotone"
                                                    dataKey="count"
                                                    stroke="#7c3aed"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#7c3aed' }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-72 flex flex-col justify-center items-center text-center p-6 bg-gray-50 dark:bg-purple-400/20 rounded-lg">
                                        <User className="w-12 h-12 text-violet-600 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                            No Applications Yet
                                        </h3>
                                        <p className="text-gray-500 max-w-sm">
                                            Share your job posting to start receiving applications.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="shadow-md border dark:border-zinc-800 border-violet-100 bg-white dark:bg-purple-100/10">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex justify-between items-center text-lg">
                                    <span>Applications Overview</span>
                                    <Badge variant="secondary" className="bg-violet-100 text-violet-600">
                                        Real-time
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-4">
                                    <div className="text-4xl font-bold text-violet-600">
                                        {jobDetails.totalCount.toLocaleString()}
                                    </div>
                                    <p className="text-gray-500 mt-2">Total Applications</p>
                                </div>
                                {/* <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-violet-50 rounded-lg p-4 text-center">
                                        <div className="text-lg font-semibold text-violet-600">
                                            {Math.round(jobDetails.totalCount * 0.6)}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Qualified</p>
                                    </div>
                                    <div className="bg-violet-50 rounded-lg p-4 text-center">
                                        <div className="text-lg font-semibold text-violet-600">
                                            {Math.round(jobDetails.totalCount * 0.3)}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">New Today</p>
                                    </div>
                                </div> */}
                            </CardContent>
                        </Card>

                        <Card className="shadow-md border dark:border-zinc-800 border-violet-100 bg-white dark:bg-purple-100/10">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Job Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { icon: Building2, label: "Company", text: jobDetails.companyName },
                                        { icon: Mail, label: "Email", text: jobDetails.contactEmail },
                                        { icon: Phone, label: "Phone", text: jobDetails.contactPhone },
                                        { icon: DollarSign, label: "Salary", text: jobDetails.salaryRange },
                                        { icon: Calendar, label: "Deadline", text: jobDetails.applicationDeadline?.toLocaleDateString() }
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-purple-400/20"
                                        >
                                            <item.icon className="h-5 w-5 text-violet-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">{item.label}</p>
                                                <p className="font-medium">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobAnalyticsDashboard;

const LoadingScreen = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 flex flex-col items-center">
            <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <Brain className="w-16 h-16 text-violet-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">Loading Job Analytics</h2>
            <div className="w-48 h-2 bg-violet-100 rounded-full overflow-hidden mx-auto">
                <motion.div
                    className="h-full bg-violet-600 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>
        </div>
    </div>
);

const ErrorScreen = () => (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md border border-red-100">
            <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6" />
                    Error Loading Job
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-gray-600">Invalid Job ID or the job posting might have been removed.</p>
                <Button
                    onClick={() => window.history.back()}
                    className="bg-violet-600 hover:bg-violet-700"
                >
                    Go Back
                </Button>
            </CardContent>
        </Card>
    </div>
);