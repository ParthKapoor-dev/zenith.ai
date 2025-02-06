
from langchain_ollama import OllamaLLM

# Define LLM model
llm = OllamaLLM(
    model="mistral",
    temperature=0
)