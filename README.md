# Zenith AI

Zenith AI is an AI-driven recruitment platform designed to revolutionize the hiring process. By leveraging advanced natural language processing (NLP) and vector search techniques, Zenith AI allows recruiters to interact with an intelligent chatbot that extracts and structures job requirements, ultimately returning a ranked list of candidates from a vector database.

## Overview

Zenith AI streamlines recruitment by enabling:
- **Candidate Onboarding:** Candidates can create accounts, submit resumes, and provide detailed information about their experiences, projects, skills, education, salary expectations, and more.
- **Smart Recruitment Chatbot:** Recruiters interact with a chatbot that uses state-of-the-art language models to translate natural language queries into structured job requirements.
- **Efficient Candidate Matching:** The structured query is used to search a vector database containing candidate profiles, returning the best matches based on multiple criteria.

## Features

- **Interactive Chatbot:** Guides recruiters through a conversational interface to collect all necessary job requirements.
- **Structured Data Extraction:** Converts natural language input into a structured JSON format using LLMs and output parsers.
- **Vectorized Candidate Profiles:** Candidate information is vectorized and stored in a vector database for efficient similarity searches.
- **Customizable Workflows:** Leverage LangChain and Ollama to fine-tune conversation flows and maintain chat context.
- **Privacy and Scalability:** Self-hostable and designed to ensure data privacy while scaling with your recruitment needs.

## Architecture

Zenith AI consists of three main components:

1. **Candidate Module:**
   - **Account Creation & Resume Submission:** Candidates upload their resumes and provide structured information.
   - **Vectorization:** The candidate's data is transformed into a vector representation and stored in a vector database.

2. **Recruiter Chatbot:**
   - **Chat Interface:** Recruiters interact with a chatbot to define job requirements.
   - **LLM-Powered Query Translation:** The chatbot converts natural language queries into structured job requirements.
   - **Conversational Memory:** Uses LangChain’s memory (e.g., `ConversationBufferWindowMemory`) to maintain context over multiple interactions.

3. **Matching & Search:**
   - **Vector Search:** The structured query is used to perform a similarity search in the candidate vector database.
   - **Ranked Candidate List:** The system returns a ranked list of candidates that best match the recruiter’s requirements.

## Technologies

- **LangChain:** Manages prompt templates, conversational memory, and chaining of LLM tasks.
- **OllamaLLM:** Provides a self-hostable LLM backend (e.g., Llama 3.2) for generating chatbot responses.
- **Hugging Face Transformers:** For entity extraction and text generation.
- **Pydantic:** Used for data validation and modeling (JobRequirements schema).
- **Vector Database:** Stores candidate vectors (e.g., Pinecone, Weaviate, or a custom FAISS/Upstash solution).
- **Python & FastAPI:** Core server and API logic.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/zenith-ai.git
   cd zenith-ai
   ```

2. **Create a Virtual Environment & Install Dependencies:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the project root and add necessary configuration (e.g., database URL, API keys).

4. **Run the Application:**

   ```bash
   uvicorn app.main:app --reload
   ```

## Usage

- **Candidate Module:**  
  Candidates register and submit resumes via the web interface. Their structured data is vectorized and stored.

- **Recruiter Chatbot:**  
  Recruiters interact with the chatbot by typing natural language queries. The chatbot extracts details and confirms the structured job requirements before performing candidate searches.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

Zenith AI is released under the [MIT License](LICENSE).

## Contact

For any questions or support, please contact [your.email@example.com](mailto:your.email@example.com).

---

*Zenith AI – Bringing recruitment to its peak with intelligent matching and dynamic conversations.*
