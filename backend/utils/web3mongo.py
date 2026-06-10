import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/landing-project")

_client = AsyncIOMotorClient(MONGODB_URL)
db = _client.get_default_database()

users = db.users
orders = db.orders
messages = db.messages
notifications = db.notifications
coupons = db.coupons
