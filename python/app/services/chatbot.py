from langchain.prompts import ChatPromptTemplate, PromptTemplate
from langchain.schema import SystemMessage, HumanMessage
from langchain_ollama import OllamaLLM
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
    ("human", "{input}"),
])

llm = OllamaLLM(
    model="llama3.2",
    temperature=0
)

ollama_chat_chain = chat_prompt | llm

async def generate_response( user_input: str) -> str:
    """Process recruiter input and generate appropriate response"""
    async for chunk in ollama_chat_chain.astream({"input": user_input}):
        yield json.dumps({"text": chunk})

    # try:
    #     # Run the chain
    #     response = ollama_chat_chain.invoke({"input" : user_input})
    #     return response

    # except Exception as e:
    #     return f"I apologize, but I encountered an error. Could you please rephrase your request? Error: {str(e)}"


# def main():
#     while True:
#         user_input = input("Recruiter: ")
#         if user_input.lower() == "exit":
#             break
            
#         response = chat(user_input)
#         print(f"Assistant: {response}")


# if __name__ == "__main__":
#     main()