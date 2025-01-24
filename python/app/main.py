from fastapi import APIRouter, HTTPException, Depends, status, FastAPI, WebSocket, Request
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from app.routes import candidates, testing, recruiters
from app.services.chatbot import chat

app = FastAPI(
    title="Zenith AI",
    description="AI Recruitment Platform",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",  # Allow requests from Next.js
    "http://127.0.0.1:3000",
]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # API Key Authentication
# API_KEY = "my-secret-api-key"
# api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)

# @app.middleware('http')
# async def verify_auth(request : Request, call_next):
#     if api_key != API_KEY:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid API Key"
#         )

#Register Routes
app.include_router(candidates.router, prefix="/candidates", tags=['Candidates Routes'])
app.include_router(recruiters.router, prefix='/recruiters', tags=['Recruiters Routes'])
app.include_router(testing.router, prefix='/testing', tags=['Testing Routes'])

#Root endpoint
@app.get("/")
def read_root():
    return {"message" : "Welcome to Jobverse AI"}