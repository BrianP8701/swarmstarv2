import asyncio
from data import Database

db = Database()
asyncio.run(db.create_all_tables())
