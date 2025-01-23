'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, UserCheck, Star } from 'lucide-react';

const steps = [
    {
        title: 'Upload Resume',
        description: 'Upload your resume for information extraction',
        icon: FileText
    },
    {
        title: 'Validate Information',
        description: 'Review and confirm your details',
        icon: UserCheck
    },
    {
        title: 'Additional Info',
        description: 'Help us match you better',
        icon: Star
    }
];

interface StepperProps {
    currentStep: number; // 0-based index
}

const ProgressBar = ({ currentStep }: StepperProps) => {

    if (currentStep > 2) currentStep = 2;

    return (
        <div className="w-full max-w-3xl mx-auto mb-12 max-md:max-w-xl">
            <div className="relative flex justify-between">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />

                {/* Animated Progress Line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 -translate-y-1/2"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />

                {/* Steps */}
                {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center text-sm">
                            {/* Step Circle */}
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    backgroundColor: isCompleted || isActive ? 'rgb(124, 58, 237)' : 'rgb(229, 231, 235)',
                                }}
                                transition={{ duration: 0.2 }}
                                className={`relative flex items-center justify-center w-12 h-12 max-md:w-8 max-md:h-8 rounded-full shadow-lg ${isActive && "dark:!bg-purple-950"}`}
                            >
                                <StepIcon className={`w-6 h-6 max-md:w-4 max-md:h-4 ${isCompleted || isActive ? 'text-white' : 'text-gray-400'}`} />

                                {/* Pulse Animation for Active Step */}
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0.5, scale: 1 }}
                                        animate={{ opacity: 0, scale: 1.5 }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full bg-violet-600"
                                    />
                                )}
                            </motion.div>

                            {/* Step Title */}
                            <motion.div
                                className="absolute -bottom-8 w-[10rem] max-md:w-fit max-md:-bottom-14 text-center max-md:text-xs"
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <p className={`font-medium mb-1 ${isActive ? 'text-violet-600' : 'text-gray-600'}`}>
                                    {step.title}
                                </p>
                                {/* <p className="text-xs text-gray-500 leading-tight">
                                    {step.description}
                                </p> */}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
};

export default ProgressBar;