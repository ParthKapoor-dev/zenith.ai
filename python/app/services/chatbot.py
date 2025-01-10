from langchain.llms import HuggingFacePipeline
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline

# Step 1: Load the Flan-T5-Small Model and Tokenizer
def load_flan_t5_pipeline():
    model_name = "google/flan-t5-base"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    
    # Create a pipeline for text2text-generation
    hf_pipeline = pipeline("text2text-generation", model=model, tokenizer=tokenizer, device=0)  # Use device=0 for GPU
    return hf_pipeline

# Step 2: Initialize LangChain with HuggingFacePipeline
def initialize_langchain(hf_pipeline):
    # Create LangChain LLM wrapper
    llm = HuggingFacePipeline(pipeline=hf_pipeline)
    
    # Add conversation memory to track context
    memory = ConversationBufferMemory()
    
    # Create a conversation chain
    conversation_chain = ConversationChain(llm=llm, memory=memory)
    return conversation_chain

# Step 3: Test the Chatbot
def chatbot_test():
    # Load the Flan-T5 pipeline
    hf_pipeline = load_flan_t5_pipeline()
    
    # Initialize LangChain with memory
    conversation_chain = initialize_langchain(hf_pipeline)
    
    print("Chatbot initialized! Start chatting below:")
    print("Type 'exit' to stop the conversation.\n")
    
    # Chat loop
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Chatbot: Goodbye!")
            break
        # Generate a response
        response = conversation_chain.invoke(user_input)
        print(f"Chatbot: {response}")

# Run the chatbot test
if __name__ == "__main__":
    chatbot_test()
