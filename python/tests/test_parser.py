import unittest
import os
from app.services.parser import parse_resume

class TestResumeParser(unittest.TestCase):

    def setUp(self):
        """Set up test resources."""
        self.test_file_path = os.path.join("tests", "resumes", "test_resume.pdf") 
        self.expected_output = {
            "name": "Parth Kapoor",
            "email": "parthkapoor.coder@gmail.com",
            "phone": "7009822678",
            "city": "Patiala , Punjab",
            "experiences": [
                {
                    "job_title": "Software Engineer",
                    "company_name": "Tech Corp",
                    "duration_of_work": "Jan 2020 - Dec 2022",
                    "job_description": "Worked on backend systems and APIs.",
                },
                {
                    "job_title": "Intern",
                    "company_name": "Startup Inc",
                    "duration_of_work": "Jun 2019 - Dec 2019",
                    "job_description": "Assisted in developing mobile applications.",
                },
            ],
            "projects": [
                {
                    "project_name": "E-commerce Website",
                    "duration": "6 months",
                    "project_description": "Developed a full-stack e-commerce application.",
                    "skills_obtained": ["React", "Node.js"],
                }
            ],
            "education": [
                {
                    "name_of_institution": "University of California",
                    "education_title": "Bachelor of Science in Computer Science",
                    "duration_of_education": "2016 - 2020",
                    "marks_obtained": "3.8 GPA",
                    "onGoing": False,
                }
            ],
            "skills": ["Python", "React", "Node.js", "Docker"],
        }

    def test_parse_resume(self):
        """Test parsing a resume."""
        parsed_output = parse_resume(self.test_file_path)
        print(parsed_output)
        self.assertEqual(parsed_output, self.expected_output, "Parsed resume data does not match expected output.")

if __name__ == "__main__":
    unittest.main()
