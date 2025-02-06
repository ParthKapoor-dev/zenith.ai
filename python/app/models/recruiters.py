from pydantic import BaseModel
from typing import Optional, List


class ChatMessage(BaseModel):
    """Pydantic model for validating chat messages"""
    input: Optional[str] = None
    response: Optional[str] = None

class ChatInit(BaseModel):
    """Pydantic model for chat initialization"""
    type: str
    messages: List[ChatMessage]

class ChatInput(BaseModel):
    """Pydantic model for chat input"""
    message: str
