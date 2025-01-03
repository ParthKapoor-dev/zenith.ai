'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Building2, Calendar, Clock, DollarSign, Mail, Phone, AlertCircle, CheckCircle2, UserCircle2 } from 'lucide-react';
import { Job } from '@/types/job';
import { toast } from '@/hooks/use-toast';
import fetchServerAction from '@/lib/fetchHelper';
import fetchJobDetails from '@/actions/candidate/application/fetchJobDetails';
import { FaMoneyBillWave } from 'react-icons/fa';
import submitApplication from '@/actions/candidate/application/submitApplication';

interface JobDetailsProps extends Job {
    applications: {
        jobId: string,
        applicantId: number
    }[]
}

const JobApplicationPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    const [jobDetails, setJobDetails] = useState<JobDetailsProps>();
    const [error, setError] = useState(false);

    // Server Action
    const fetchData = async () => 
        setJobDetails(await fetchServerAction(
            async () => fetchJobDetails((await params).slug), null, () => setError(true)))

    useEffect(() => {
        fetchData();
    }, []);

    if (!jobDetails) return <LoadingScreen />;
    if (error) return <ErrorScreen />;

    const handleApply = async () => {
        try {
            await submitApplication(jobDetails.id)
            toast({
                title: "Application Submitted!",
                description: "Your application has been successfully submitted."
            });
            window.location.reload();
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to submit application. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="min-h-screen ">
            <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="shadow-xl border-2">
                        <CardHeader className="space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-bold text-gray-900">
                                        {jobDetails.title}
                                    </CardTitle>
                                    <CardDescription className="text-lg text-gray-600">
                                        {jobDetails.companyName}
                                    </CardDescription>
                                </div>
                                {jobDetails.applications[0] && (
                                    <Badge className="bg-green-100 text-green-700">
                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                        Applied
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8">
                            {/* Job Details Grid */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { icon: FaMoneyBillWave, label: "Salary Range", value: jobDetails.salaryRange },
                                    { icon: Calendar, label: "Application Deadline", value: jobDetails.applicationDeadline?.toLocaleDateString() },
                                    { icon: Mail, label: "Contact Email", value: jobDetails.contactEmail },
                                    { icon: Phone, label: "Contact Phone", value: jobDetails.contactPhone || "Not provided" }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                                    >
                                        <item.icon className="w-5 h-5 text-violet-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">{item.label}</p>
                                            <p className="font-medium text-gray-900">{item.value}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Job Description */}
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                                <div className="whitespace-pre-wrap text-gray-700">
                                    {jobDetails.description}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                {jobDetails.applications[0] ? (
                                    <Card className="w-full bg-green-50 border-green-100">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-green-100 p-3 rounded-full">
                                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-green-700">Application Submitted</h3>
                                                    <p className="text-sm text-green-600">
                                                        Please wait for the recruiter's response. We'll notify you of any updates.
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleApply}
                                            className="flex-1 bg-violet-600 hover:bg-violet-700"
                                        >
                                            Apply Now
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-violet-200 text-violet-600 hover:bg-violet-50"
                                            onClick={() => window.location.href = '/profile'}
                                        >
                                            <UserCircle2 className="w-4 h-4 mr-2" />
                                            Update Profile
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

const LoadingScreen = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 flex flex-col items-center justify-center">
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <Brain className="w-16 h-16 text-violet-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">Loading Job Details</h2>
            <div className="w-48 h-2 bg-violet-100 rounded-full overflow-hidden">
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
        <Card className="w-full max-w-md shadow-lg border-red-100">
            <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6" />
                    Error Loading Job
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                    Unable to load job details. The job posting might have been removed or is no longer available.
                </p>
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

export default JobApplicationPage;