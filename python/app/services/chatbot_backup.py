from langchain.prompts import ChatPromptTemplate, PromptTemplate, MessagesPlaceholder
from langchain.schema import SystemMessage, HumanMessage
from langchain_ollama import OllamaLLM
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, model_validator
from kor.extraction import create_extraction_chain
from kor.nodes import Object, Text, Number
from typing import List, Optional
import json

# Define the structured output for job requirements
class JobRequirements(BaseModel):
    job_type: Optional[str] = Field(
        default=None, description="Type of job (e.g., Full-time, Part-time, Contract)"
    )
    required_skills: Optional[List[str]] = Field(
        default=None, description="List of skills required for the job"
    )
    experience: Optional[List[str]] = Field(
        default=None, description="Experience required for each skill"
    )
    # job_type: str = Field(description="Type of job role (e.g., 'Backend Development', 'Deep Learning Engineer')")
    # required_skills: List[str] = Field(description="List of required technical skills")
    # skill_experience: dict = Field(description="Dictionary mapping skills to years of experience required")
    # total_experience: float = Field(description="Total years of experience required in the job type")
    # employment_type: str = Field(description="Type of employment ('Intern', 'Freelancer', 'Full Time')")
    # min_salary: Optional[float] = Field(description="Minimum salary requirement")
    # additional_requirements: Optional[dict]     = Field(description="Any additional specific requirements")

requirement_schema = Object(
    id="requirements",
    description="Job Information",
    examples=[
        ("I want to hire a Backend developer, with Experience in Express JS",
            {
                "job_title": "Backend Developer",
                "skill": "Express JS"
                # Skills: ["Express JS", "JWT", "MongoDB"]
            }
        )
    ],
    attributes=[
        Text(
            id="job_title",
            description="Type of job role"
        ),
        Text(
            id="skill",
            description="Required Technical Skills"
        ),
    ],
    many=False
)


# Initialize the parser
parser = PydanticOutputParser(pydantic_object=JobRequirements)

# Create system message for the chatbot
system_message = """You are an expert AI recruitment assistant. Your role is to:
    1. Help recruiters define their job requirements clearly
    2. Provide guidance on hiring for different roles
    3. Convert natural language queries into structured job requirements
    4. Ask for missing important information

    Guidelines:
    - Always maintain a professional and helpful tone
    - If requirements are unclear, ask for clarification
    - Provide informed suggestions about technical roles
    - Help recruiters understand technical requirements
    - If you detect any discriminatory or inappropriate requirements, provide constructive feedback

    When parsing requirements, ensure all fields in the JobRequirements model are properly filled."""



parsing_prompt = PromptTemplate(
    template="""
        Based on the following recruiter input, extract the job requirements into a structured format.

        Input: {user_input}        

        {format_instructions}

        """,
    input_variables=["user_input"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

# Create the chat prompt
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", system_message),
    ("human", "{input}"),
])

llm =  OllamaLLM(
    model="llama3.2",
    temperature=0
)

chain = chat_prompt | llm

extraction_chain = create_extraction_chain(llm, requirement_schema)

def process_input( user_input: str) -> str:
    """Process recruiter input and generate appropriate response"""
    try:
        # Run the chain
        response = chain.invoke({"input" : user_input})
        
        # Check if the input appears to be job requirements
        # TODO: Fix, checking for requirements

        if any(keyword in user_input.lower() for keyword in ["looking for", "need", "hire", "requirements"]):
            try:
                # Attempt to parse structured requirements
                parsed_requirements = extraction(user_input)
                print(f"Parsed information, {parsed_requirements}")
                # Validate requirements and ask for missing information
                return validate_and_respond(parsed_requirements, response)
            except Exception as e:
                # If parsing fails, continue with normal conversation
                print(f"Failed ERROR: {e}")
                return response
        
        return response

    except Exception as e:
        return f"I apologize, but I encountered an error. Could you please rephrase your request? Error: {str(e)}"

def extraction(input: str) -> JobRequirements:
    """Parse natural language into structured job requirements"""
    
    # parsing_model = parsing_prompt | llm
    # parse_response = parsing_model.invoke({"user_input": input })
    # print("PARSED RESPONE", parse_response)
    # return parser.invoke(parse_response)
    extracted_info = extraction_chain.invoke(input)
    print("Extracted Info", extracted_info)
    return extracted_info

def validate_and_respond(requirements: JobRequirements, original_response: str) -> str:
    """Validate requirements and generate appropriate response"""
    missing_fields = []
    
    # Check for missing or incomplete required fields
    if not requirements.required_skills:
        missing_fields.append("specific required skills")
    if not requirements.skill_experience:
        missing_fields.append("years of experience for each skill")
    if not requirements.job_type:
        missing_fields.append("specific job type")
    
    if missing_fields:
        missing_info = ", ".join(missing_fields)
        return f"{original_response}\n\nTo help me find the best candidates, could you please provide more information about: {missing_info}?"
    
    # If all required fields are present, format the confirmation
    return f"""I understand you're looking for:
- Job Type: {requirements.job_type}
- Required Skills: {', '.join(requirements.required_skills)}
- Experience Requirements: {json.dumps(requirements.skill_experience, indent=2)}
- Employment Type: {requirements.employment_type}
- Total Experience: {requirements.total_experience} years
{f'- Minimum Salary: {requirements.min_salary}' if requirements.min_salary else ''}

Is this correct? I can help you refine these requirements or proceed with the search."""

# Example usage
def main():
    print(parser.get_format_instructions())
    while True:
        user_input = input("Recruiter: ")
        if user_input.lower() == "exit":
            break
            
        response = process_input(user_input)
        print(f"Assistant: {response}")

def sampleFunc():
    # Define your desired data structure.
    class Joke(BaseModel):
        setup: str = Field(description="question to set up a joke")
        punchline: str = Field(description="answer to resolve the joke")


    # Set up a parser + inject instructions into the prompt template.
    parser = PydanticOutputParser(pydantic_object=Joke)

    prompt = PromptTemplate(
        template="Answer the user query.\n{format_instructions}\n{query}\n",
        input_variables=["query"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    print("Format Instructions", parser.get_format_instructions())

    # And a query intended to prompt a language model to populate the data structure.
    prompt_and_model = prompt | llm
    output = prompt_and_model.invoke({"query": "Tell me a joke."})
    resp = parser.invoke(output)
    print("Output", output)
    print("Parsed Response", resp)
    



if __name__ == "__main__":
    # print(parser.get_format_instructions())
    main()
    # sampleFunc()