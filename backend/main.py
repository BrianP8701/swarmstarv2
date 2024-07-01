from fastapi import FastAPI

import logger_config

app = FastAPI()



@app.get("/")
async def read_root():
    return {"Hello": "World"}