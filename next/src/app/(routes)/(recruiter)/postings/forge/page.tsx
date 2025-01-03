'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import createJob from '@/actions/recruiter/jobs/createJob';
import { Job } from '@/types/job';
import { v4 as uuidv4 } from 'uuid';
import { formatDate } from '@/lib/formatDates';

const JobPostingPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Job>({
        title: '',
        description: '',
        applicationDeadline: undefined,
        contactEmail: '',
        contactPhone: '',
        salaryRange: '',
        companyName: '',
        createdAt: new Date,
        updatedAt: new Date,
        id: uuidv4(),
        createdBy: -1
    });

    const handleSubmit = async () => {
        if ([formData.title, formData.description, formData.contactEmail, formData.salaryRange, formData.companyName].includes('')) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await createJob(formData);
            router.push('/postings/' + formData.id);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isSubmitting ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gradient-to-br from-violet-50 to-fuchsia-50 z-50 flex items-center justify-center"
                >
                    <div className="text-center space-y-6 max-w-md mx-auto p-6">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Loader2 className="w-16 h-16 text-violet-600 animate-spin mx-auto" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-800">Creating Job Posting</h2>
                        <p className="text-gray-600">Please wait while we process your submission...</p>
                        <div className="space-y-2">
                            <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-violet-600"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="min-h-screen pb-4 sm:pb-6 lg:pb-8"
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                Create Job Posting
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Fill in the details for your job opening
                            </p>
                        </div>

                        <Card className="shadow-lg border-2">
                            <CardHeader>
                                <CardTitle>Job Details</CardTitle>
                                <CardDescription>
                                    Provide comprehensive information about the position
                                </CardDescription>
                                {/* <Alert className="bg-blue-50 text-blue-800 border-blue-200 flex items-center justify-center">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Please ensure your salary expectations are realistic and aligned with market standards for better chances of being shortlisted.
                                        </AlertDescription>
                                    </Alert> */}
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Input
                                        placeholder="Job Title*"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="mb-4"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Textarea
                                        placeholder="Description*"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="mb-4 min-h-[150px]"
                                    />
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Input
                                            type="date"
                                            placeholder="Application Deadline"
                                            value={formatDate(formData.applicationDeadline || new Date())}
                                            onChange={(e) => setFormData({ ...formData, applicationDeadline: new Date(e.target.value) })}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Input
                                            placeholder="Salary Range*"
                                            value={formData.salaryRange}
                                            onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                                        />
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Input
                                        placeholder="Company Name"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="mb-4"
                                    />
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <Input
                                            type="email"
                                            placeholder="Contact Email*"
                                            value={formData.contactEmail}
                                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <Input
                                            type="tel"
                                            placeholder="Contact Phone"
                                            value={formData.contactPhone}
                                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        />
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90 transition-opacity"
                                    >
                                        Post Job
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default JobPostingPage;