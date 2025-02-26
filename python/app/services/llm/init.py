from langchain_ollama import OllamaLLM
from langchain_huggingface import HuggingFaceEndpoint
from app.config import HF_API_KEY, GEMINI_API_KEY
from langchain_core.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI

genai.configure(api_key=GEMINI_API_KEY)


# llm = OllamaLLM(
#     model="mistral",
#     temperature=0 
# )

# callbacks = [StreamingStdOutCallbackHandler()]

# llm = HuggingFaceEndpoint(
#     endpoint_url="https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", 
#     huggingfacehub_api_token=HF_API_KEY,
#     temperature=0.1,
#     max_new_tokens=512,
#     streaming=True,
#     callbacks=callbacks
#     # Removed model_kwargs={"stop": ["\n"]}
# )


llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.7, api_key=GEMINI_API_KEY)