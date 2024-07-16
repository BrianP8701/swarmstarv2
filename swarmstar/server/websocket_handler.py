import asyncio
from fastapi import WebSocket, WebSocketDisconnect

async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            message = {
                "title": "Test message",
                "payload": "This is a test payload"
            }
            await websocket.send_json(message)
            print('sent message')
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        print("Client disconnected")
