from fastapi import WebSocket, WebSocketDisconnect
import json
from langchain_community.chat_message_histories import ChatMessageHistory
from app.services.chatbot import generate_response
from datetime import datetime

async def handle_ws_chatbot(websocket: WebSocket):
    """
    WebSocket-based chat for recruiters. 
    - Stores previous chat messages for context.
    - Streams AI-generated responses in real-time.
    - Clears messages when session disconnects.
    """
    await websocket.accept()

    try:
        while True:
            # Receive recruiter input
            data = await websocket.receive_text()
            json_data = json.loads(data)

            print("received data", data)

            if json_data.get('type') == 'init':
                print('getting Messages')
                messages = json_data.get('messages')
                print(messages)
                continue
            
            input_message = json_data.get('message')

            async for chunk in generate_response(input_message):
                await websocket.send_text(chunk)

            await websocket.send_text(json.dumps({
                "done": True,
                "timestamp": datetime.now().isoformat()
            }))

    except WebSocketDisconnect:
        print("WebSocket Connection Closed")

