# uvicorn main:app --reload
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import logger_config

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_text("Test message from server")
            print('sent message')
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        print("Client disconnected")

@app.get("/")
async def read_root():
    return {"Hello": "World"}
