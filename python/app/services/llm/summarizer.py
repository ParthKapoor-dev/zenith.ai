
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain.schema import HumanMessage, AIMessage

from typing import List, AsyncGenerator
import logging

from app.models.recruiters import ChatMessage
from app.services.llm.init import llm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



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


def process_message_history(messages: List[ChatMessage]):
    """Process and add message history to the session"""

    session = ChatMessageHistory()

    for msg in messages:
        if msg.input:
            session.add_message(HumanMessage(content=msg.input))
        elif msg.response:
            session.add_message(AIMessage(content=msg.response))
    return session

# Chain
summarization_chain = summarization_prompt | llm

async def summarize_chat(msgs: List[ChatMessage]) -> AsyncGenerator[str,None]:
    try:    
        chatHistory = process_message_history(msgs)
        print(chatHistory)
        messages = chatHistory.messages
        summary = summarization_chain.invoke({"messages": messages})

        print("Summary is ", summary)

        return summary
    
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        return None