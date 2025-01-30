from fastapi import WebSocket, WebSocketDisconnect, HTTPException, status
from typing import Optional, Dict, List, AsyncGenerator
import json
import logging
from datetime import datetime
from pydantic import BaseModel, ValidationError
import asyncio
from contextlib import asynccontextmanager

from langchain_community.chat_message_histories import ChatMessageHistory
from langchain.schema import HumanMessage, AIMessage, BaseMessage

from app.services.chatbot import generate_response
from app.core.exceptions import ChatbotError


# Configure logging
logger = logging.getLogger(__name__)

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

class WebSocketManager:
    """Manages active WebSocket connections and their associated chat histories"""
    def __init__(self):
        self.active_sessions: Dict[WebSocket, ChatMessageHistory] = {}

    async def connect(self, websocket: WebSocket) -> None:
        """Handle new WebSocket connection"""
        await websocket.accept()
        self.active_sessions[websocket] = ChatMessageHistory()
        logger.info(f"New WebSocket connection established: {id(websocket)}")

    def disconnect(self, websocket: WebSocket) -> None:
        """Handle WebSocket disconnection"""
        if websocket in self.active_sessions:
            del self.active_sessions[websocket]
            logger.info(f"WebSocket connection closed: {id(websocket)}")

    def get_session(self, websocket: WebSocket) -> ChatMessageHistory:
        """Get chat history for a WebSocket connection"""
        return self.active_sessions.get(websocket)

    def update_session(self, ws: WebSocket, session: ChatMessageHistory):
        self.active_sessions[ws] = session

ws_manager = WebSocketManager()

async def send_response(websocket: WebSocket, chunk: str) -> None:
    """Safely send response chunks to the client"""
    try:
        await websocket.send_text(chunk)
    except Exception as e:
        logger.error(f"Error sending response: {str(e)}")
        raise ChatbotError("Failed to send response")

async def send_completion_message(websocket: WebSocket) -> None:
    """Send completion message with timestamp"""
    try:
        await websocket.send_text(json.dumps({
            "done": True,
            "timestamp": datetime.now().isoformat()
        }))
    except Exception as e:
        logger.error(f"Error sending completion message: {str(e)}")
        raise ChatbotError("Failed to send completion message")

def process_message_history(messages: List[ChatMessage]) -> None:
    """Process and add message history to the session"""

    session = ChatMessageHistory()

    for msg in messages:
        if msg.input:
            session.add_message(HumanMessage(content=msg.input))
        elif msg.response:
            session.add_message(AIMessage(content=msg.response))
    return session

@asynccontextmanager
async def handle_websocket_lifecycle(websocket: WebSocket):
    """Context manager for WebSocket lifecycle"""
    try:
        await ws_manager.connect(websocket)
        yield
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        raise
    finally:
        ws_manager.disconnect(websocket)

async def handle_ws_chatbot(websocket: WebSocket) -> None:
    """
    Production-grade WebSocket-based chat handler for recruiters.
    Features:
    - Robust error handling and logging
    - Message validation using Pydantic
    - Structured session management
    - Graceful connection handling
    - Real-time response streaming
    """
    async with handle_websocket_lifecycle(websocket):
        try:
            while True:
                # Receive and validate input
                try:
                    data = await websocket.receive_text()
                    json_data = json.loads(data)
                except json.JSONDecodeError as e:
                    logger.error(f"Invalid JSON received: {str(e)}")
                    await websocket.send_text(json.dumps({
                        "error": "Invalid JSON format",
                        "timestamp": datetime.now().isoformat()
                    }))
                    continue

                session = ws_manager.get_session(websocket)
                if not session:
                    raise ChatbotError("No active session found")

                # Handle initialization
                if json_data.get('type') == 'init':
                    try:
                        init_data = ChatInit(**json_data)
                        session = process_message_history(init_data.messages)
                        ws_manager.update_session(websocket, session)
                        print('WebSocket Init', init_data)
                        logger.info("Chat session initialized successfully")
                        continue
                    except ValidationError as e:
                        logger.error(f"Invalid init data: {str(e)}")
                        await websocket.send_text(json.dumps({
                            "error": "Invalid initialization data",
                            "timestamp": datetime.now().isoformat()
                        }))
                        continue

                # Handle chat input
                try:
                    chat_input = ChatInput(**json_data)
                    session.add_message(HumanMessage(content=chat_input.message))

                    # Generate and stream response
                    async for chunk in generate_response(chat_input.message, session):
                        await send_response(websocket, chunk)
                    
                    await send_completion_message(websocket)
                    logger.debug(f"Chat history updated: {len(session.messages)} messages")

                except ValidationError as e:
                    logger.error(f"Invalid chat input: {str(e)}")
                    await websocket.send_text(json.dumps({
                        "error": "Invalid chat input",
                        "timestamp": datetime.now().isoformat()
                    }))
                except ChatbotError as e:
                    logger.error(f"Chatbot error: {str(e)}")
                    await websocket.send_text(json.dumps({
                        "error": str(e),
                        "timestamp": datetime.now().isoformat()
                    }))
                except Exception as e:
                    logger.error(f"Unexpected error: {str(e)}")
                    await websocket.send_text(json.dumps({
                        "error": "An unexpected error occurred",
                        "timestamp": datetime.now().isoformat()
                    }))

        except WebSocketDisconnect:
            logger.info(f"WebSocket disconnected: {id(websocket)}")
        except Exception as e:
            logger.error(f"Fatal error in WebSocket handler: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error"
            )