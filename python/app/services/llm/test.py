from huggingface_hub import InferenceClient
from app.config import HF_API_KEY

client = InferenceClient(
	provider="together",
	api_key=HF_API_KEY
)

messages = [
	{
		"role": "user",
		"content": "What is the capital of France?"
	}
]

completion = client.chat.completions.create(
    model="mistralai/Mistral-7B-Instruct-v0.3", 
	messages=messages, 
	max_tokens=500
)