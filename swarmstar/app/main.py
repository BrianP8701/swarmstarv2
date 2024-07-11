# uvicorn main:app --reload
from app.types import CreateSwarmPayload, SendSwarmMessagePayload
from fastapi import FastAPI, WebSocket
from swarmstar.utils.logger_config import setup_logging
from app.websocket_handler import websocket_endpoint

setup_logging()

app = FastAPI()

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)

@app.get("/swarms")
async def get_swarms():
    # Implementation here
    pass

@app.get("/swarmstar_space")
async def get_swarmstar_space():
    # Implementation here
    pass

@app.post("/create_swarm")
async def create_swarm(payload: CreateSwarmPayload):
    # Implementation here
    pass

@app.post("/send_message")
async def send_message(payload: SendSwarmMessagePayload):
    # Implementation here
    pass

@app.get("/swarm_node/{swarm_node_id}")
async def get_swarm_node(swarm_node_id: int):
    # Implementation here
    pass

@app.get("/memory_node/{memory_node_id}")
async def get_memory_node(memory_node_id: int):
    # Implementation here
    pass

@app.get("/tool_node/{tool_node_id}")
async def get_tool_node(tool_node_id: int):
    # Implementation here
    pass

@app.get("/action_node/{action_node_id}")
async def get_action_node(action_node_id: int):
    # Implementation here
    pass
