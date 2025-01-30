from langchain.prompts import ChatPromptTemplate, PromptTemplate, MessagesPlaceholder
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from langchain_ollama import OllamaLLM
from langchain_community.chat_message_histories import ChatMessageHistory
import json

# Create system message for the chatbot
system_message = """You are an expert AI recruitment assistant. Your role is to:
    1. Help recruiters define their job requirements clearly
    2. Provide guidance on hiring for different roles
    3. Ask for missing important information

    Guidelines:
    - Always maintain a professional and helpful tone
    - If requirements are unclear, ask for clarification
    - Provide informed suggestions about technical roles
    - Help recruiters understand technical requirements
    - If you detect any discriminatory or inappropriate requirements, provide constructive feedback"""

# Create the chat prompt
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", system_message),
    MessagesPlaceholder(variable_name='messages'),
    ("human", "{input}"),
])

llm = OllamaLLM(
    model="llama3.2",
    temperature=0
)

ollama_chat_chain = chat_prompt | llm

async def generate_response( user_input: str, chatHistory) -> str:
    """Process recruiter input and generate appropriate response"""

    messages = chatHistory.messages

    async for chunk in ollama_chat_chain.astream({"input": user_input,"messages": messages}):
        yield json.dumps({"text": chunk})

    chatHistory.add_message(AIMessage(content=chunk))
    print("Chat History", chatHistory)


def main():
    print("hello world")

if __name__ == '__main__':
    main()