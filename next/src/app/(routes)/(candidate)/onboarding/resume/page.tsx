"use client"

import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { IoMdPlanet } from "react-icons/io";
import uploadResume from '@/actions/candidate/resumeUpload';
import User from '@/types/user';
import { useUser } from '@/hooks/useUser';
import { BorderBeam } from '@/components/ui/border-beam';

const UploadResumePage = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userInfo = useUser();
        if (userInfo) setUser(userInfo);
    }, [])

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
        }
    }, []);

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
        }
    };

    const validateFile: (file: File | null) => boolean = (file: File | null) => {
        if (!file) return false;

        const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!validTypes.includes(file.type)) {
            toast({
                variant: "destructive",
                title: "Invalid file type",
                description: "Please upload a PDF or Word document",
            });
            return false;
        }

        if (file.size > 5 * 1024 * 1024) {
            // 5MB limit
            toast({
                variant: "destructive",
                title: "File too large",
                description: "Please upload a file smaller than 5MB",
            });
            return false;
        }

        return true;
    };
    const handleSubmit = async () => {
        if (!file || !user) return;

        setIsUploading(true);
        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('file', file);


            await uploadResume(formData);

            toast({
                title: 'Resume uploaded successfully!',
                description: 'You will be redirected to complete your profile.',
            });


            window.location.reload()

        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Upload failed',
                description: 'Please try again later'
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative h-full w-full overflow-hidden flex items-center justify-center p-4 max-md:text-sm">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg relative z-10 flex flex-col gap-8"
            >

                <Card className="backdrop-blur-xl bg-white/80 dark:bg-purple-500/10 shadow-2xl border-0 relative">
                    <CardContent className="py-8 px-8 flex flex-col gap-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center flex flex-col gap-4"
                        >
                            <h1 className="text-3xl font-bold flex items-center justify-center gap-4 max-md:flex-col">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white rounded-full p-2 shadow-lg"
                                >
                                    <IoMdPlanet className="w-8 h-8 text-purple-600" />
                                </motion.div>
                                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    Submit Resume
                                </span>
                            </h1>

                            <div className="flex gap-1 items-center max-md:flex-col">
                                <Sparkles className="w-5 h-5 text-violet-600 dark:text-cyan-400 mt-1 flex-shrink-0" />
                                <p className="text-sm text-violet-700 dark:text-cyan-200 text-center">
                                    Take the first step towards your dream job. Upload your resume to access AI-powered job matching and career opportunities.
                                </p>
                            </div>

                        </motion.div>

                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-300 hover:border-purple-400'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    onChange={handleFileInput}
                                    accept=".pdf,.doc,.docx"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        {file ? (
                                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                                        ) : (
                                            <Upload className="w-12 h-12 text-purple-500" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-600">
                                            {file
                                                ? `Selected: ${file.name}`
                                                : 'Drag and drop your resume here, or click to browse'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Supported formats: PDF, DOC, DOCX (Max 5MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={!file || isUploading}
                                className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 dark:from-cyan-400 dark:to-violet-700 transition-all"
                            >
                                {isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Submit Resume
                                    </span>
                                )}
                            </Button>

                            <p className="text-xs text-center text-slate-500">
                                By submitting your resume, you agree to our{' '}
                                <a href="#" className="text-purple-600 hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-purple-600 hover:underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </motion.div>
                    </CardContent>
                    <BorderBeam duration={6} />
                </Card>
            </motion.div>
        </div>
    );
};

export default UploadResumePage