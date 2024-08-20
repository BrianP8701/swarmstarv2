import asyncio

from data import Database

db = Database()

asyncio.run(db.delete_all_tables())
asyncio.run(db.create_all_tables())
