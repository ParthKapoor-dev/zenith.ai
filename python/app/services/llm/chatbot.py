import asyncio
import json
import logging
import re
from typing import Optional, List, AsyncGenerator

from pydantic import BaseModel, Field
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import AIMessage
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.output_parsers import JsonOutputParser

from app.services.llm.init import llm 

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------------------
# Helper function to clean extra tokens
# ------------------------------
def clean_llm_output(output: str) -> str:
    """
    Remove extra header/footer tokens that may appear in the output.
    """
    tokens_to_remove = ["<|start_header_id|>", "<|end_header_id|>", "<|eot_id|>"]
    for token in tokens_to_remove:
        output = output.replace(token, "")
    return output

# ------------------------------
# System message for the chatbot
# ------------------------------
system_message = (
    "You are Zenith, an AI Recruitment Assistant. Your role is to help users refine their job requirements and guide them through the hiring process. "
    "Do not repeat or echo the user's input. Provide only your answer in a clear and concise manner. "
    "\n\nYour Responsibilities:\n"
    "1. Understanding the User's Needs:\n"
    "   - Users can be recruiters, startup founders/employees, or individuals looking for talent.\n"
    "   - Assist them in defining job requirements based on their project needs.\n\n"
    "2. Refining Job Criteria:\n"
    "   - Ask follow-up questions to refine the search (e.g. required skills, experience level, salary, employment type, current job status, and specific responsibilities).\n\n"
    "3. Providing General Hiring Guidance:\n"
    "   - Offer insights into technical hiring and answer general recruitment questions.\n\n"
    "4. Guiding Users to Action:\n"
    "   - Instruct the user to click the \"Get Candidates\" button when sufficient information is gathered.\n\n"
    "Important: Your response should contain only the answer (do not include the user’s query or any extraneous text)."
)

# ------------------------------
# Define the Pydantic model for job criteria
# ------------------------------
class JobCriteria(BaseModel):
    preferred_skills: List[str] = Field(description="List of required skills or technologies")
    experience_level: Optional[str] = Field(description="Desired experience level (e.g., Junior, Mid, Senior)")
    salary_expectations: Optional[str] = Field(description="Salary expectations or range")
    employment_type: Optional[str] = Field(description="Type of employment (e.g., full-time, part-time, freelancer, internship)")
    current_job_status: Optional[str] = Field(description="Candidate's current job status (e.g., actively looking, open to offers)")
    job_responsibilities: Optional[str] = Field(description="Specific job responsibilities or duties")

# Initialize the structured output parser
requirement_parser = JsonOutputParser(pydantic_object=JobCriteria)

# ------------------------------
# Chat prompt for conversation generation
# ------------------------------
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", system_message),
    MessagesPlaceholder(variable_name='messages'),
    ("human", "{input}"),
])

# ------------------------------
# Parser prompt for structured output extraction
# ------------------------------
# We instruct the assistant to return only a JSON object with no additional tokens.
parser_prompt = ChatPromptTemplate.from_messages([
    ("system", (
        "You are an AI Recruitment Assistant. Your role is to extract and structure the user's job requirements into a valid JSON object. "
        "Return ONLY the JSON object that strictly follows the schema provided below. Do not include any additional commentary, explanations, or text. "
        "Output exactly one JSON object and nothing else.\n\n"
        "Schema:\n"
        "{format_instructions}\n\n"
        "Ensure your output is valid JSON."
    )),
    MessagesPlaceholder(variable_name='messages'),
]).partial(format_instructions=requirement_parser.get_format_instructions())


# ------------------------------
# Summarization prompt for query generation (if needed)
# ------------------------------
summarization_prompt = ChatPromptTemplate.from_messages([
    ("system", (
        "You are an AI Recruitment Assistant. Your role is to summarize the recruiter's conversation into a single, concise query that captures their job requirements and intent. "
        "The query should include required skills, experience level, job responsibilities, and any additional context, and must be semantically aligned with candidate vectorization. "
        "Do not include irrelevant details or small talk."
    )),
    MessagesPlaceholder(variable_name='messages'),
])

# ------------------------------
# Create chains using the prompts and LLM
# ------------------------------
# Note: We assume 'llm' is already set up (without a conflicting 'stop' parameter).
ollama_chat_chain = chat_prompt | llm
parser_chain = parser_prompt | llm | requirement_parser
# summarization_chain = summarization_prompt | llm   # Uncomment if needed

# ------------------------------
# Response Generation Function
# ------------------------------
async def generate_response(user_input: str, chatHistory: ChatMessageHistory) -> AsyncGenerator[str, None]:
    """
    Processes recruiter input and generates a response with streaming.
    Cleans extra tokens from the LLM output, updates the chat history,
    and then extracts structured job requirements from the conversation.
    """
    messages = chatHistory.messages
    full_response = ""

    try:
        # Generate response (streaming)
        async for chunk in ollama_chat_chain.astream({"input": user_input, "messages": messages}):
            # Clean the chunk to remove any stray header/footer tokens
            # clean_chunk = clean_llm_output(chunk)
            chunk_text = chunk.content if hasattr(chunk, "content") else str(chunk)
            print(chunk)
            response_data = json.dumps({"text": chunk_text})
            yield response_data
            full_response += chunk_text

        # Store the cleaned full response in chat history
        chatHistory.add_message(AIMessage(content=full_response))
        logger.info("Chat History Updated: %s", chatHistory)

        test_chain = parser_prompt | llm
        structured_raw = test_chain.invoke({"messages": messages})
        structured_json = requirement_parser.parse(structured_raw.content)
        logger.info("Chatbot Resp for structuring", structured_raw)
        logger.info("JSON ", structured_json)
        print(f"JSON Structure \n \n {structured_json} \n \n ")
        structured_clean = clean_llm_output(structured_json) if isinstance(structured_json, str) else structured_json

        if structured_clean:
            logger.info("Structured Response: %s", structured_clean)
            yield json.dumps({"structured_data": structured_clean})
        else:
            logger.warning("No structured data extracted")
            yield json.dumps({"structured_data": None})

    except Exception as e:
        logger.error(f"Error generating response: {e}")
        yield json.dumps({"error": "An error occurred while processing your request."})

# ------------------------------
# (Optional) Main runner for testing
# ------------------------------
if __name__ == "__main__":
    # For testing purposes, create a simple chat history and run the generate_response function.
    async def main():
        # Initialize an empty chat history
        chat_history = ChatMessageHistory()
        # Simulate a user message
        user_message = "I want to hire a backend engineer with 5 years of experience."
        # Run the response generator
        async for output in generate_response(user_message, chat_history):
            print(output)
    
    asyncio.run(main())
