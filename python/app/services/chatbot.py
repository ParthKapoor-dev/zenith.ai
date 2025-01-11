from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.llms import Ollama
from pydantic import BaseModel, Field
from typing import List, Optional

# Define the structure for job requirements
class JobRequirement(BaseModel):
    skills: List[dict] = Field(
        description="List of required skills with experience (in years)",
        example=[{"skill": "Python", "years": 3}, {"skill": "React", "years": 2}]
    )
    education: dict = Field(
        description="Required education details",
        example={"degree": "BTech", "field": "Computer Science"}
    )
    min_salary: Optional[float] = Field(description="Minimum salary requirement")
    availability: Optional[str] = Field(description="Expected availability/notice period")
    is_complete: bool = Field(description="Whether all necessary information is gathered")

class RecruiterChatbot:
    def __init__(self):
        # Initialize LLM (example using Ollama with Mistral)
        self.llm = Ollama(model="mistral")

        # Initialize memory with the correct variable name
        self.memory = ConversationBufferMemory(
            memory_key="history",
            input_key="input"
        )

        # Initialize output parser
        self.parser = PydanticOutputParser(pydantic_object=JobRequirement)

        # Create base prompt template
        self.base_prompt = PromptTemplate(
            input_variables=["history", "input", "format_instructions"],
            template="""
            You are a professional recruitment assistant. Your goal is to gather detailed job requirements from recruiters.

            Previous conversation:
            {history}

            Current input: {input}

            Based on the conversation, extract or update the job requirements. If information is missing, ask relevant follow-up questions.
            Be conversational but focused on gathering specific details about skills, experience, education, and other requirements.

            {format_instructions}
            """
        )

        # Initialize conversation chain with the correct configuration
        self.conversation = LLMChain(
            llm=self.llm,
            prompt=self.base_prompt,
            memory=self.memory,
            verbose=True
        )

        self.current_requirements = JobRequirement(
            skills=[],
            education={},
            min_salary=None,
            availability=None,
            is_complete=False
        )

    def process_input(self, user_input: str) -> tuple[str, JobRequirement]:
        # Add format instructions to help LLM structure output
        format_instructions = self.parser.get_format_instructions()

        # Get response from LLM with the correct variable mapping
        response = self.conversation.predict(
            input=user_input,
            format_instructions=format_instructions
        )

        try:
            # Try to parse updated requirements
            new_requirements = self.parser.parse(response)
            self.current_requirements = new_requirements
        except Exception as e:
            print(f"Failed to parse requirements: {e}")
            # If parsing fails, keep current requirements
            pass

        # Check if we need more information
        if not self.current_requirements.is_complete:
            if not self.current_requirements.skills:
                return "What specific skills are you looking for, and how many years of experience are required for each?", self.current_requirements
            elif not self.current_requirements.education:
                return "What education qualifications are required for this position?", self.current_requirements
            elif not self.current_requirements.min_salary:
                return "What's the minimum salary range for this position?", self.current_requirements
            elif not self.current_requirements.availability:
                return "What's the expected availability or notice period requirement?", self.current_requirements

        # If we have all information, ask for confirmation
        return self._generate_confirmation_message(), self.current_requirements

    def _generate_confirmation_message(self) -> str:
        return f"""
        Based on our conversation, here's what I understood about your requirements:

        Skills Required:
        {', '.join([f"{s['skill']} ({s['years']} years)" for s in self.current_requirements.skills])}

        Education: {self.current_requirements.education.get('degree', '')} in {self.current_requirements.education.get('field', '')}
        Minimum Salary: {self.current_requirements.min_salary}
        Availability: {self.current_requirements.availability}

        Is this correct? Should I proceed with searching for matching candidates?
        """

# Example usage
def main():
    chatbot = RecruiterChatbot()

    print("Chatbot: Hello! I'm here to help you find the right candidates. What kind of position are you looking to fill?")

    while True:
        user_input = input("Recruiter: ")
        if user_input.lower() in ['quit', 'exit']:
            break

        response, requirements = chatbot.process_input(user_input)
        print(f"Chatbot: {response}")

        if requirements.is_complete and "yes" in user_input.lower():
            # Here you would connect to your vector DB and search for candidates
            print("Searching for matching candidates...")
            break

if __name__ == "__main__":
    main()
