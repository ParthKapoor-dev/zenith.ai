'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, X } from 'lucide-react';
import { employmentTypes, roles as availRoles } from '@/db/schema/enum';

import { useRef } from 'react';
import { Check } from 'lucide-react';
import fetchServerAction from '@/lib/fetchHelper';
import fetchCandidate from '@/actions/candidate/fetchCandidate';
import Candidate from '@/types/candidate';
import finalizeAccount from '@/actions/candidate/finalizeCandidate';
import { useRouter } from 'next/navigation';    
import { ShineBorder } from '@/components/ui/shine-border';

const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

const jobCategories = {
    "Engineering": [
        "Backend Developer",
        "Frontend Developer",
        "Full Stack Developer",
        "Mobile Developer",
        "DevOps Engineer",
        "Cloud Engineer",
        "Security Engineer",
        "Machine Learning Engineer"
    ],
    "Data": [
        "Data Scientist",
        "Data Engineer",
        "Data Analyst",
        "Business Intelligence Analyst"
    ],
    "Design": [
        "UI Designer",
        "UX Designer",
        "Product Designer",
        "Graphics Designer"
    ],
    "Management": [
        "Product Manager",
        "Project Manager",
        "Technical Lead",
        "Engineering Manager"
    ]
};

const availabilityOptions = [
    { value: "immediate", label: "Immediate" },
    { value: "15days", label: "15 Days Notice" },
    { value: "1month", label: "1 Month Notice" },
    { value: "2months", label: "2 Months Notice" },
    { value: "3months", label: "3 Months Notice" },
    { value: "summer", label: "Summer 2024" }
];

type role = typeof availRoles[number]

const UserPreferencesPage = () => {

    const router = useRouter();
    const [formData, setFormData] = useState<Candidate>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Server Actions
    const getCurrentData = async () =>
        setFormData(await fetchServerAction<Candidate | undefined>(fetchCandidate, undefined))

    useEffect(() => {
        getCurrentData();
    }, [])

    if (!formData) return <>Loading</>

    const handleSubmit = async () => {
        if (!formData.salaryExpectation || formData.preferredRole?.length === 0 || !formData.availability) {
            setError('Please fill in all required fields');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await finalizeAccount(formData);
            router.push('/')
            console.log(formData);
        } catch (error) {
            console.error('Error:', error);
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
                    className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
                >
                    <div className="text-center space-y-6 max-w-md mx-auto p-6">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Loader2 className="w-16 h-16 text-violet-600 animate-spin mx-auto" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-800">Setting Up Your Preferences</h2>
                        <p className="text-gray-600">
                            Please keep this tab open while we process your information...
                        </p>
                        <div className="space-y-2">
                            <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-violet-600"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>
                            <p className="text-sm text-gray-500">This will only take a moment</p>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="min-h-screen px-4 sm:px-6 lg:px-8"
                >
                    <div className="max-w-3xl mx-auto ">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                Career Preferences
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Let's customize your job search preferences
                            </p>
                        </div>

                        <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className='dark:bg-purple-100/10 shadow-xl '>
                            <Card className=" bg-white/0 shadow-none border-none">
                                <CardHeader>
                                    <CardTitle>Salary Expectations</CardTitle>
                                    <CardDescription>
                                        Set your preferred salary and employment details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {/* Salary Section */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    value={formData.salaryExpectation || ""}
                                                    onChange={(e) => setFormData({ ...formData, salaryExpectation: e.target.value })}
                                                    placeholder="Enter amount"
                                                    className="pl-8"
                                                />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                    {currencies.find(c => c.code === formData.currencyType)?.symbol}
                                                </span>
                                            </div>

                                            <Select
                                                value={formData.currencyType || undefined}
                                                onValueChange={(value: any) => setFormData({ ...formData, currencyType: value })}
                                            >
                                                <SelectTrigger >
                                                    <SelectValue placeholder="Select currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {currencies.map((currency) => (
                                                        <SelectItem key={currency.code} value={currency.code}>
                                                            {currency.code} - {currency.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={formData.salaryPeriod || undefined}
                                                onValueChange={(value: any) => setFormData({ ...formData, salaryPeriod: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Salary period" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="monthly">Per Month</SelectItem>
                                                    <SelectItem value="annual">Per Annum</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Please ensure your salary expectations are realistic and aligned with market standards for better chances of being shortlisted.
                                            </AlertDescription>
                                        </Alert>
                                    </div>

                                    {/* Employment Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Employment Type</label>
                                        <div className="flex flex-wrap gap-2">
                                            {employmentTypes.map((type) => (
                                                <Badge
                                                    key={type}
                                                    variant={formData.employmentType === type ? "default" : "outline"}
                                                    className={`cursor-pointer ${formData.employmentType === type
                                                        ? 'bg-violet-600 hover:bg-violet-700'
                                                        : 'hover:border-violet-600 hover:text-violet-600'
                                                        }`}
                                                    onClick={() => setFormData({ ...formData, employmentType: type })}
                                                >
                                                    {type}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>


                                    {/* Job Roles */}

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Preferred Roles (Select up to 5)
                                        </label>
                                        <MultiSelectRoles
                                            selected={formData.preferredRole || []}
                                            onChange={(roles) => setFormData({ ...formData, preferredRole: roles })}
                                            maxSelections={5}
                                        />
                                    </div>

                                    {/* Availability */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Availability</label>
                                        <Select
                                            value={formData.availability}
                                            onValueChange={(value: any) => setFormData({ ...formData, availability: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select availability" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availabilityOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90 transition-opacity"
                                    >
                                        Save Preferences
                                    </Button>
                                </CardContent>
                                {/* <BorderBeam size={200} duration={8} /> */}
                            </Card>
                        </ShineBorder>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UserPreferencesPage;




const MultiSelectRoles = ({
    selected,
    onChange,
    maxSelections = 5
}: {
    selected: role[],
    onChange: (value: role[]) => void
    maxSelections?: number
}) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Flatten roles for searching while keeping category info
    const allRoles = Object.entries(jobCategories).flatMap(([category, roles]) =>
        roles.map(role => ({ role, category }))
    );

    const filteredRoles = searchValue
        ? allRoles.filter(({ role }) =>
            role.toLowerCase().includes(searchValue.toLowerCase())
        )
        : allRoles;

    const handleSelect = (role: role) => {
        setSearchValue('')
        if (selected.includes(role)) {
            onChange(selected.filter(r => r !== role));
        } else if (selected.length < maxSelections) {
            onChange([...selected, role]);
        }
    };

    return (
        <div className="relative w-full">
            <div
                className="relative w-full border dark:border-gray-100 rounded-md shadow-sm"
                onClick={() => {
                    setOpen(true);
                    inputRef.current?.focus();
                }}
            >
                <div className="flex flex-wrap gap-1 p-2">
                    {selected.map(role => (
                        <Badge
                            key={role}
                            variant="default"
                            className="bg-violet-600 text-white gap-1"
                        >
                            {role}
                            <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(role);
                                }}
                            />
                        </Badge>
                    ))}
                    <input
                        ref={inputRef}
                        className="flex-1 bg-transparent outline-none min-w-[120px] placeholder:text-gray-500 "
                        placeholder={selected.length === 0 ? "Search roles..." : ""}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setOpen(true)}
                    />
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute w-full z-50 top-full mt-1 bg-white dark:bg-darkPurple rounded-md border shadow-lg max-h-60 overflow-auto"
                        >
                            <div className="p-1">
                                {filteredRoles.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-gray-500">
                                        No roles found
                                    </div>
                                ) : (
                                    Object.entries(jobCategories).map(([category, roles]) => {
                                        const filteredCategoryRoles = roles.filter(role =>
                                            role.toLowerCase().includes(searchValue.toLowerCase())
                                        ) as role[];

                                        if (filteredCategoryRoles.length === 0) return null;

                                        return (
                                            <div key={category}>
                                                <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                                    {category}
                                                </div>
                                                {filteredCategoryRoles.map(role => (
                                                    <div
                                                        key={role}
                                                        className={`
                              flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer
                              ${selected.includes(role)
                                                                ? 'bg-violet-50 text-violet-900'
                                                                : 'hover:bg-gray-50 dark:hover:bg-purple-700'
                                                            }`}
                                                        onClick={() => handleSelect(role)}
                                                    >
                                                        <span>{role}</span>
                                                        {selected.includes(role) && (
                                                            <Check className="w-4 h-4 text-violet-600" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })
                                )}
                                {selected.length >= maxSelections && (
                                    <div className="px-2 py-1.5 text-sm text-orange-500 bg-orange-50">
                                        Maximum {maxSelections} roles can be selected
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
