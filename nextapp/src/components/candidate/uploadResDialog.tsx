"use client"

import { DialogTrigger } from "../ui/dialog"

import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
    File,
    Upload,
    Loader2,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from "react";
import { cn } from "@/lib/utils";


export default function UploadResDialog({ className }: { className?: string }) {
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };
    const validateFile = (file: File | null) => {
        if (!file) return false;
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            toast({
                variant: "destructive",
                title: "Invalid file type",
                description: "Please upload a PDF or Word document"
            });
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "File too large",
                description: "Please upload a file smaller than 5MB"
            });
            return false;
        }
        return true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
            setSelectedFile(file);
        }
    };


    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (validateFile(file || null)) {
            setSelectedFile(file || null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            // Simulating upload
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast({
                title: "Resume uploaded successfully",
                description: "Your profile has been updated"
            });
            setIsUploadModalOpen(false);
            setSelectedFile(null);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: "Please try again later"
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger
                onClick={() => setIsUploadModalOpen(true)}
                className={cn(className, "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 flex px-4 py-2 rounded-lg items-center")}
            >
                <Upload className="w-4 h-4 mr-2" />
                Update Resume
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Resume</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div
                        className={`
                relative border-2 border-dashed rounded-xl p-8 text-center
                transition-colors duration-200 ease-in-out cursor-pointer
                ${isDragging
                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                : 'border-zinc-200 dark:border-zinc-800 hover:border-violet-500'
                            }
              `}
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
                                {selectedFile ? (
                                    <File className="w-12 h-12 text-violet-500" />
                                ) : (
                                    <Upload className="w-12 h-12 text-violet-500" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {selectedFile
                                        ? `Selected: ${selectedFile.name}`
                                        : 'Drag and drop your resume here, or click to browse'
                                    }
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsUploadModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                        >
                            {isUploading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            {isUploading ? 'Uploading...' : 'Upload Resume'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )

}