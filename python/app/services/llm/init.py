from langchain_ollama import OllamaLLM
from langchain_huggingface import HuggingFaceEndpoint
from app.config import HF_API_KEY
# from langchain_core.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

llm = OllamaLLM(
    model="mistral",
    temperature=0
)

# callbacks = [StreamingStdOutCallbackHandler()]

# llm = HuggingFaceEndpoint(
#     endpoint_url="https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct",  
#     huggingfacehub_api_token=HF_API_KEY,
#     temperature=0.1,
#     max_new_tokens=512,
#     streaming=True,
#     # callbacks=callbacks
#     # Removed model_kwargs={"stop": ["\n"]}
# )
