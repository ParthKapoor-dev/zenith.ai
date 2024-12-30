'use client'

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Save, Loader2, ChevronDown, ChevronUp, X, AlertTriangle } from 'lucide-react';
import validationHelperFns from './HelperFns';
import Candidate from '@/types/candidate';
import updateProfile from '@/actions/candidate/updateProfile';
import fetchServerAction from '@/lib/fetchHelper';
import fetchCandidate from '@/actions/candidate/fetchCandidate';


const ValidationPage = () => {

    const getCurrentData = async () => {
        const data = await fetchServerAction<Candidate | undefined>(fetchCandidate, undefined)
        console.log(data);

        if (data) setFormData(data)
    }

    const [formData, setFormData] = useState<Candidate>(mockData);
    const [expandedSections, setExpandedSections] = useState({
        experiences: false,
        projects: false,
        skills: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [skillType, setSkillType] = useState<'proficient' | 'other_skills'>('proficient');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        getCurrentData();
    }, [])

    // Helper Functions
    const {
        handleAddSkill,
        handleRemoveSkill,
        addNewProject,
        handleProjectChange,
        deleteProject,
        addNewExperience,
        handleExperienceChange,
        deleteExperience
    } = validationHelperFns(formData, newSkill, skillType, setFormData, setNewSkill)

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const validateForm = (): boolean => {
        const errors: string[] = [];

        formData.experiences.forEach((exp, index) => {
            if (!exp.jobTitle) errors.push(`Experience ${index + 1}: Job title is required`);
            if (!exp.companyName) errors.push(`Experience ${index + 1}: Company name is required`);
        });

        formData.projects.forEach((proj, index) => {
            if (!proj.projectTitle) errors.push(`Project ${index + 1}: Project title is required`);
        });

        if (formData.proficientSkills.length === 0) {
            errors.push('At least one proficient skill is required');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await updateProfile(formData);
            console.log('Submitted data:', formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                    AI Resume Validation
                </h1>
                <p className="text-slate-600">
                    Our AI has analyzed your resume. Please review and confirm the extracted information.
                </p>
            </motion.div>

            {validationErrors.length > 0 && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Experience Section */}
            <Card className="border-2 border-violet-100 shadow-lg">
                <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleSection('experiences')}>
                    <CardTitle className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                                {formData.experiences.length}
                            </Badge>
                            Professional Experience
                        </span>
                        {expandedSections.experiences ? <ChevronUp /> : <ChevronDown />}
                    </CardTitle>
                </CardHeader>
                <AnimatePresence>
                    {expandedSections.experiences && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CardContent className="space-y-6">
                                {formData.experiences.map((exp, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-4 border-2 rounded-lg space-y-4 relative hover:border-violet-200 transition-colors"
                                    >
                                        <div className="absolute -top-3 -left-3">
                                            <Badge className="bg-violet-600">Experience {index + 1}</Badge>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute -top-3 -right-3"
                                            onClick={() => deleteExperience(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                value={exp.jobTitle}
                                                onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                                                placeholder="Job Title"
                                            />
                                            <Input
                                                value={exp.companyName}
                                                onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
                                                placeholder="Company Name"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                type="date"
                                                value={exp.startDate}
                                                onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                            />
                                            <Input
                                                type="date"
                                                value={exp.endDate}
                                                onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                            />
                                        </div>
                                        <Textarea
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="h-24"
                                        />

                                    </motion.div>
                                ))}
                                <Button
                                    onClick={addNewExperience}
                                    variant="outline"
                                    className="w-full mt-4 border-dashed border-2 hover:border-violet-400 hover:text-violet-600"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Experience
                                </Button>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            {/* Projects Section - Similar enhancements as Experience section */}
            <Card className="border-2 border-violet-100 shadow-lg">
                <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleSection('projects')}>
                    <CardTitle className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                                {formData.projects.length}
                            </Badge>
                            Projects
                        </span>
                        {expandedSections.projects ? <ChevronUp /> : <ChevronDown />}
                    </CardTitle>
                </CardHeader>
                <AnimatePresence>
                    {expandedSections.projects && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CardContent className="space-y-6">
                                {formData.projects.map((project, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-4 border-2 rounded-lg space-y-4 relative hover:border-violet-200 transition-colors"
                                    >
                                        <div className="absolute -top-3 -left-3">
                                            <Badge className="bg-violet-600">Project {index + 1}</Badge>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute -top-3 -right-3"
                                            onClick={() => deleteProject(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                        <Input
                                            value={project.projectTitle}
                                            onChange={(e) => handleProjectChange(index, 'projectTitle', e.target.value)}
                                            placeholder="Project Title"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                type="date"
                                                value={project.startDate}
                                                onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)}
                                            />
                                            <Input
                                                type="date"
                                                value={project.endDate}
                                                onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)}
                                            />
                                        </div>
                                        <Textarea
                                            value={project.description}
                                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="h-24"
                                        />
                                    </motion.div>
                                ))}
                                <Button
                                    onClick={addNewProject}
                                    variant="outline"
                                    className="w-full mt-4 border-dashed border-2 hover:border-violet-400 hover:text-violet-600"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Project
                                </Button>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            {/* Skills Section - Enhanced with better visual hierarchy */}
            <Card className="border-2 border-violet-100 shadow-lg">
                <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleSection('skills')}>
                    <CardTitle className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                                {formData.proficientSkills.length + formData.otherSkills.length}
                            </Badge>
                            Skills
                        </span>
                        {expandedSections.skills ? <ChevronUp /> : <ChevronDown />}
                    </CardTitle>
                </CardHeader>
                <AnimatePresence>
                    {expandedSections.skills && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium mb-2">Proficient Skills</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.proficientSkills.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    variant="secondary"
                                                    className="px-3 py-1 flex items-center gap-2"
                                                >
                                                    {skill}
                                                    <X
                                                        className="w-3 h-3 cursor-pointer"
                                                        onClick={() => handleRemoveSkill('proficient', skill)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-2">Other Skills</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.otherSkills.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    variant="outline"
                                                    className="px-3 py-1 flex items-center gap-2"
                                                >
                                                    {skill}
                                                    <X
                                                        className="w-3 h-3 cursor-pointer"
                                                        onClick={() => handleRemoveSkill('other_skills', skill)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            placeholder="Add a new skill"
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                        />
                                        <select
                                            className="border rounded-md px-3"
                                            value={skillType}
                                            onChange={(e) => setSkillType(e.target.value as 'proficient' | 'other_skills')}
                                        >
                                            <option value="proficient">Proficient</option>
                                            <option value="other_skills">Other</option>
                                        </select>
                                        <Button onClick={handleAddSkill}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            <div className="flex justify-end mt-8">
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90 transition-opacity"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Validating with AI...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Confirm and Save
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};




export default ValidationPage;




const mockData: Candidate = {
    "userId": 1,
    "resume": "",
    "proficientSkills": ['react'],
    "otherSkills": ['react'],
    "experiences": [
        {
            "id": -1,
            "jobTitle": "Backend Developer",
            "companyName": "Tech Solutions",
            "startDate": "2019-06-01",
            "endDate": "2022-05-01",
            "description": "Developed RESTful APIs using Python and Django. Integrated Docker for containerized deployments.",
        },
        {
            "id": -1,
            "jobTitle": "Software Engineer",
            "companyName": "Innovatech",
            "startDate": "2022-06-01",
            "endDate": "2023-06-01",
            "description": "Enhanced scalability of the backend using Flask and optimized database queries in MongoDB.",
        },
    ],
    "projects": [
        {
            "id": -1,
            "projectTitle": "E-commerce API",
            "startDate": "2021-01-01",
            "endDate": "2021-06-01",
            "description": "Built a scalable e-commerce API using Django and integrated payment gateways.",
        }
    ],
    updatedAt: new Date(),
    createdAt: new Date()
}