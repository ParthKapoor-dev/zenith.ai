import Candidate, { Experience, Project } from "@/types/candidate";


export default function validationHelperFns(
    formData: Candidate,
    newSkill: string,
    skillType: 'proficient' | 'other_skills',
    setFormData: React.Dispatch<Candidate>,
    setNewSkill: React.Dispatch<React.SetStateAction<string>>
) {



    // Skills Helper Functions
    const handleAddSkill = () => {
        if (newSkill.trim()) {

            if (skillType == 'proficient')
                setFormData({
                    ...formData,
                    proficientSkills: [
                        ...formData.proficientSkills,
                        newSkill.trim()
                    ]
                });
            else setFormData({
                ...formData,
                otherSkills: [
                    ...formData.otherSkills,
                    newSkill.trim()
                ]
            });

            setNewSkill('');
        }
    };

    const handleRemoveSkill = (type: 'proficient' | 'other_skills', skill: string) => {
        if (type == 'proficient')
            setFormData({
                ...formData,
                proficientSkills: [
                    ...formData.proficientSkills.filter(s => s !== skill)
                ]
            });
        else setFormData({
            ...formData,
            otherSkills: [
                ...formData.otherSkills.filter(s => s !== skill)
            ]
        })

    };

    // Experiences Helper Functions
    const addNewExperience = () => {
        const newExperience: Experience = {
            jobTitle: '',
            companyName: '',
            startDate: '',
            endDate: '',
            description: '',
            id: -1
        };
        setFormData({
            ...formData,
            experiences: [...formData.experiences, newExperience]
        });
    };

    const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
        const newExperiences = [...formData.experiences];
        newExperiences[index] = { ...newExperiences[index], [field]: value };
        setFormData({ ...formData, experiences: newExperiences });
    };

    const deleteExperience = (index: number) => {
        const newExperiences = formData.experiences.filter((_, i) => i !== index);
        setFormData({ ...formData, experiences: newExperiences });
    };

    // Project Helper Functions
    const addNewProject = () => {
        const newProject: Project = {
            projectTitle: '',
            startDate: '',
            endDate: '',
            description: '',
            id: -1
        };
        setFormData({
            ...formData,
            projects: [...formData.projects, newProject]
        });
    };

    const handleProjectChange = (index: number, field: keyof Project, value: string) => {
        const newProjects = [...formData.projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        setFormData({ ...formData, projects: newProjects });
    };


    const deleteProject = (index: number) => {
        const newProjects = formData.projects.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, projects: newProjects });
    };


    return {
        handleAddSkill,
        handleRemoveSkill,
        addNewProject,
        handleProjectChange,
        deleteProject,
        addNewExperience,
        handleExperienceChange,
        deleteExperience,
    }

}