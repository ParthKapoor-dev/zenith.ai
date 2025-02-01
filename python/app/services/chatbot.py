import asyncio
import json
import logging
from typing import Optional, List, AsyncGenerator
from pydantic import BaseModel, Field, ValidationError
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from langchain_ollama import OllamaLLM
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.output_parsers import JsonOutputParser

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# System message for the chatbot
system_message = """You are Zenith, an AI Recruitment Assistant. Your role is to **help users refine their job requirements** and **guide them through the hiring process**. 
You do not decide who is suitable for the job, nor do you filter candidates based on criteria—that is handled by the candidate retrieval system.

### **Your Responsibilities:**
1. **Understanding the User's Needs:**
   - Users can be recruiters, startup founders/employees, or individuals looking for talent.
   - Assist them in defining job requirements based on their project needs.

2. **Refining Job Criteria:**
   - When a user describes the candidate they are looking for, your role is to **ask follow-up questions** to refine the search. 
   - Ensure details such as:
     - Required skills / tech stack
     - Experience level
     - Minimum salary expectations
     - Employment type (freelancer, full-time, internship)
     - Current job status (actively looking, open to offers, etc.)
     - Any specific job responsibilities
   - If a user provides an incomplete or vague request, ask clarifying questions.

3. **Providing General Hiring Guidance:**
   - Offer insights into hiring for technical roles.
   - Answer general questions about recruitment, such as hiring best practices, skills required for certain roles, or industry norms.

4. **Guiding Users to Action:**
   - Once sufficient information has been gathered, **instruct the user to click the "Get Candidates" button** to see a ranked list of candidates that match their criteria.

### **Guidelines:**
- **You do not judge salary expectations or hiring preferences.** Your role is to gather and refine information, not filter candidates.
- **Remain neutral and professional.** If a job posting is unusual (e.g., low salary), you may **ask clarifying questions** rather than reject it.
- **If a requirement is unclear, always seek clarification.**
- **Do not reject any job requests outright.** The retrieval system will match candidates based on availability.

Remember, **your job is to refine the query and assist the user—not to decide who is suitable for the job.**"""

# Define the Pydantic model for job criteria
class JobCriteria(BaseModel):
    preferred_skills: List[str] = Field(description="List of required skills or technologies")
    experience_level: Optional[str] = Field(description="Desired experience level (e.g., Junior, Mid, Senior)")
    salary_expectations: Optional[str] = Field(description="Salary expectations or range")
    employment_type: Optional[str] = Field(description="Type of employment (e.g., full-time, part-time, freelancer, internship)")
    current_job_status: Optional[str] = Field(description="Candidate's current job status (e.g., actively looking, open to offers)")
    job_responsibilities: Optional[str] = Field(description="Specific job responsibilities or duties")

# Initialize the structured output parser
requirement_parser = JsonOutputParser(pydantic_object=JobCriteria)

# Define the chat prompt with the improved system message
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", system_message),
    MessagesPlaceholder(variable_name='messages'),
    ("human", "{input}"),
])

parser_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an AI Recruitment Assistant. Your role is to **extract and structure the user's job requirements** into the following JSON format:

{format_instructions}

### Instructions:
1. Analyze the conversation history and extract the job requirements.
2. Fill in the JSON structure with the extracted information.
3. If any field is missing or unclear, leave it as `null`.
4. Do not include any additional text or explanations in your response. Only provide the JSON object."""),
    MessagesPlaceholder(variable_name='messages'),
]).partial(format_instructions=requirement_parser.get_format_instructions())


summarization_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an AI Recruitment Assistant. Your role is to summarize the recruiter's conversation into a single query that captures their job requirements and intent. This query will be used to search for candidates in a vector database.

### Instructions:
1. Analyze the conversation history and identify the key requirements.
2. Summarize the requirements into a concise query that includes:
   - **Required skills / tech stack**: List the specific skills or technologies the recruiter is looking for.
   - **Experience level**: Specify the desired experience level (e.g., Junior, Mid, Senior).
   - **Job responsibilities**: Describe the key responsibilities or tasks the candidate will handle.
   - **Additional context**: Include any other relevant details provided by the recruiter (e.g., industry, project type, team size).
3. Ensure the query is **semantically aligned** with how candidates are vectorized. This means:
   - Use **keywords** and **phrases** that are likely to appear in the candidate vectors.
   - Avoid generic or vague terms unless explicitly mentioned by the recruiter.
4. Do not include irrelevant information or small talk.

### Guidelines:
- Be concise but specific.
- Use natural language that matches the candidate vectors.
- Focus on the recruiter's intent and key requirements."""),
    MessagesPlaceholder(variable_name='messages'),
])

# Define LLM model
llm = OllamaLLM(
    model="llama3.2",
    temperature=0
)

# Create an AI chain with the prompt and model
ollama_chat_chain = chat_prompt | llm
parser_chain = parser_prompt | llm | requirement_parser
summarization_chain = summarization_prompt | llm

# Response Generation Function
async def generate_response(user_input: str, chatHistory: ChatMessageHistory) -> AsyncGenerator[str, None]:
    """Processes recruiter input and generates a response with streaming"""

    messages = chatHistory.messages
    full_response = ""

    try:
        async for chunk in ollama_chat_chain.astream({"input": user_input, "messages": messages}):
            response_data = json.dumps({"text": chunk})
            yield response_data
            full_response += chunk

        # Store full response after streaming is complete
        chatHistory.add_message(AIMessage(content=full_response))
        logger.info("Chat History Updated: %s", chatHistory)

        # Extract structured information from the AI's response 
        structured_data = parser_chain.invoke({"messages": messages})
        if structured_data:
            logger.info("Structured Response: %s", structured_data)
            yield json.dumps({"structured_data": structured_data})            
        else:
            logger.warning("No structured data extracted")
            yield json.dumps({"structured_data": None})

        # Summarize Entire Chat
        summarized_chat = summarization_chain.invoke({"messages": messages})
        if summarized_chat:
            logger.info("Structured Response: %s", summarized_chat)
            yield json.dumps({"summarized_chat": summarized_chat})            
        else:
            logger.warning("No structured data extracted")
            yield json.dumps({"summarized_chat": None})

    except Exception as e:
        logger.error(f"Error generating response: {e}")
        yield json.dumps({"error": "An error occurred while processing your request."})
