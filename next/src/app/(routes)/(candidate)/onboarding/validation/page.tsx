"use client";

import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
} from "lucide-react";
import validationHelperFns from "./HelperFns";
import Candidate from "@/types/candidate";
import updateProfile from "@/actions/candidate/updateProfile";
import fetchServerAction from "@/lib/fetchHelper";
import fetchCandidate from "@/actions/candidate/fetchCandidate";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/formatDates";

const ValidationPage = () => {
  const getCurrentData = async () =>
    setFormData(
      await fetchServerAction<Candidate | undefined>(fetchCandidate, undefined)
    );

  const [formData, setFormData] = useState<Candidate>();
  const [expandedSections, setExpandedSections] = useState({
    experiences: false,
    projects: false,
    skills: false,
    education: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skillType, setSkillType] = useState<"proficient" | "other_skills">(
    "proficient"
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    getCurrentData();
  }, []);

  if (!formData) return <LoadingScreen />;

  // Helper Functions
  const {
    handleAddSkill,
    handleRemoveSkill,
    addNewProject,
    handleProjectChange,
    deleteProject,
    addNewExperience,
    handleExperienceChange,
    deleteExperience,
    addNewEdu,
    handleEduChange,
    deleteEdu,
  } = validationHelperFns(
    formData,
    newSkill,
    skillType,
    setFormData,
    setNewSkill
  );

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    formData.experiences.forEach((exp, index) => {
      if (!exp.jobTitle)
        errors.push(`Experience ${index + 1}: Job title is required`);
      if (!exp.companyName)
        errors.push(`Experience ${index + 1}: Company name is required`);
      if (!exp.startDate)
        errors.push(`Experience ${index + 1}: Start Date is required`);
      if (!exp.description)
        errors.push(`Experience ${index + 1}: Description is required`);
    });

    formData.education.forEach((edu, index) => {
      if (!edu.instituteName)
        errors.push(`Education ${index + 1}: Institute Name is required`);
      if (!edu.courseName)
        errors.push(`Education ${index + 1}: Course name is required`);
      if (!edu.startDate)
        errors.push(`Education ${index + 1}: Start Date is required`);
    });

    formData.projects.forEach((proj, index) => {
      if (!proj.projectTitle)
        errors.push(`Project ${index + 1}: Project title is required`);
      if (!proj.startDate)
        errors.push(`Experience ${index + 1}: Start Date is required`);
      if (!proj.description)
        errors.push(`Experience ${index + 1}: Description is required`);
    });

    if (formData.proficientSkills.length === 0) {
      errors.push("At least one proficient skill is required");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      console.log("Submitted data:", formData);
      router.push("/onboarding/final", {});
    } catch (error) {
      console.error("Error submitting form:", error);
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
          Our AI has analyzed your resume. Please review and confirm the
          extracted information.
        </p>
      </motion.div>

      {/* Education Section */}
      <Card className="border-[0.5px] border-violet-100 dark:bg-purple-100/10 overflow-hidden dark:border-zinc-600 shadow-lg ">
        <CardHeader
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
          onClick={() => toggleSection("education")}
        >
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-violet-100 dark:bg-violet-900 dark:text-violet-100 text-violet-800"
              >
                {formData?.education?.length}
              </Badge>
              Education
            </span>
            {expandedSections.education ? <ChevronUp /> : <ChevronDown />}
          </CardTitle>
        </CardHeader>
        <AnimatePresence>
          {expandedSections.education && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="space-y-6">
                {formData?.education?.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border-[0.5px] rounded-lg space-y-4 relative hover:border-violet-200 dark:hover:border-violet-700 dark:border-zinc-500 transition-colors"
                  >
                    <div className="absolute -top-3 -left-3">
                      <Badge className="bg-violet-600">
                        Education {index + 1}
                      </Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-3 -right-3"
                      onClick={() => deleteEdu(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        value={edu.instituteName}
                        onChange={(e) =>
                          handleEduChange(
                            index,
                            "instituteName",
                            e.target.value
                          )
                        }
                        placeholder="Institute Name"
                      />
                      <Input
                        value={edu.courseName}
                        onChange={(e) =>
                          handleEduChange(index, "courseName", e.target.value)
                        }
                        placeholder="Course Name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={formatDate(edu.startDate)}
                        onChange={(e) =>
                          handleEduChange(index, "startDate", e.target.value)
                        }
                      />

                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={formatDate(edu.endDate)}
                          onChange={(e) =>
                            handleEduChange(index, "endDate", e.target.value)
                          }
                          disabled={!edu.endDate}
                          className="border-violet-200 focus:border-violet-400"
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`still-pursuing-${index}`}
                            checked={!edu.endDate}
                            onCheckedChange={(checked: boolean) =>
                              handleEduChange(
                                index,
                                "endDate",
                                checked ? "" : new Date().toString()
                              )
                            }
                          />
                          <label
                            htmlFor={`still-pursuing-${index}`}
                            className="text-sm text-gray-600"
                          >
                            Still Pursuing
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={addNewEdu}
                  variant="outline"
                  className="w-full mt-4 border-dashed border-2 hover:border-violet-400 hover:text-violet-600 dark:bg-violet-100/10 "
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Education
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Experience Section */}
      <Card className="border-[0.5px] border-violet-100 dark:bg-purple-100/10 overflow-hidden dark:border-zinc-600 shadow-lg">
        <CardHeader
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
          onClick={() => toggleSection("experiences")}
        >
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-violet-100 dark:bg-violet-900 dark:text-violet-100 text-violet-800"
              >
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
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="space-y-6">
                {formData.experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border-2 rounded-lg space-y-4 relative hover:border-violet-200 dark:hover:border-violet-700 transition-colors"
                  >
                    <div className="absolute -top-3 -left-3">
                      <Badge className="bg-violet-600">
                        Experience {index + 1}
                      </Badge>
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
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "jobTitle",
                            e.target.value
                          )
                        }
                        placeholder="Job Title"
                      />
                      <Input
                        value={exp.companyName}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "companyName",
                            e.target.value
                          )
                        }
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={formatDate(exp.startDate)}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                      />

                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={formatDate(exp.endDate)}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          disabled={!exp.endDate}
                          className="border-violet-200 focus:border-violet-400"
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`currently-working-exp-${index}`}
                            checked={!exp.endDate}
                            onCheckedChange={(checked: boolean) =>
                              handleExperienceChange(
                                index,
                                "endDate",
                                checked ? "" : new Date().toString()
                              )
                            }
                          />
                          <label
                            htmlFor={`currently-working-exp-${index}`}
                            className="text-sm text-gray-600"
                          >
                            Currently working here
                          </label>
                        </div>
                      </div>
                    </div>
                    <Textarea
                      value={exp.description}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Description"
                      className="h-24"
                    />
                  </motion.div>
                ))}
                <Button
                  onClick={addNewExperience}
                  variant="outline"
                  className="w-full mt-4 border-dashed border-2 hover:border-violet-400 hover:text-violet-600 dark:bg-violet-100/10"
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
      <Card className="border-[0.5px] border-violet-100 dark:bg-purple-100/10 overflow-hidden dark:border-zinc-600 shadow-lg">
        <CardHeader
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
          onClick={() => toggleSection("projects")}
        >
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-violet-100 dark:bg-violet-900 dark:text-violet-100 text-violet-800"
              >
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
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="space-y-6">
                {formData.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border-2 rounded-lg space-y-4 relative hover:border-violet-200 dark:hover:border-violet-700 transition-colors"
                  >
                    <div className="absolute -top-3 -left-3">
                      <Badge className="bg-violet-600">
                        Project {index + 1}
                      </Badge>
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
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          "projectTitle",
                          e.target.value
                        )
                      }
                      placeholder="Project Title"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={formatDate(project.startDate)}
                        onChange={(e) =>
                          handleProjectChange(
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={formatDate(project.endDate)}
                          onChange={(e) =>
                            handleProjectChange(
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          disabled={!project.endDate}
                          className="border-violet-200 focus:border-violet-400"
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`currently-working-proj-${index}`}
                            checked={!project.endDate}
                            onCheckedChange={(checked: boolean) =>
                              handleProjectChange(
                                index,
                                "endDate",
                                checked ? "" : new Date().toString()
                              )
                            }
                          />
                          <label
                            htmlFor={`currently-working-proj-${index}`}
                            className="text-sm text-gray-600"
                          >
                            Currently working on this
                          </label>
                        </div>
                      </div>
                    </div>
                    <Textarea
                      value={project.description}
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Description"
                      className="h-24"
                    />
                  </motion.div>
                ))}
                <Button
                  onClick={addNewProject}
                  variant="outline"
                  className="w-full mt-4 border-dashed border-2 hover:border-violet-400 hover:text-violet-600 dark:bg-violet-100/10"
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
      <Card className="border-[0.5px] border-violet-100 dark:bg-purple-100/10 overflow-hidden dark:border-zinc-600 shadow-lg">
        <CardHeader
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
          onClick={() => toggleSection("skills")}
        >
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-violet-100 dark:bg-violet-900 dark:text-violet-100 text-violet-800"
              >
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
              animate={{ height: "auto", opacity: 1 }}
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
                            onClick={() =>
                              handleRemoveSkill("proficient", skill)
                            }
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
                            onClick={() =>
                              handleRemoveSkill("other_skills", skill)
                            }
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
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <select
                      className="border rounded-md px-3"
                      value={skillType}
                      onChange={(e) =>
                        setSkillType(
                          e.target.value as "proficient" | "other_skills"
                        )
                      }
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

      {validationErrors.length > 0 && (
        <Alert
          variant="destructive"
          className="dark:bg-red-500/10 dark:text-red-300"
        >
          <AlertTriangle className="h-4 w-4 dark:text-red-300" />
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90 transition-all duration-300"
        >
          {isSubmitting ? (
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validating with AI...
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Save className="w-4 h-4 mr-2" />
              Confirm and Save
            </motion.div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ValidationPage;

// Loading component
const LoadingScreen = () => (
  <div className="absolute inset-0 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-violet-50 to-fuchsia-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 items-center flex justify-center flex-col"
    >
      <div className="relative w-24 h-24 ">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-violet-200"
          style={{ borderTopColor: "transparent" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-fuchsia-300"
          style={{
            borderTopColor: "transparent",
            borderRightColor: "transparent",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"
      >
        Loading Your Profile...
      </motion.h2>
    </motion.div>
  </div>
);
