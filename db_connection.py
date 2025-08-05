from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

try:
    client = MongoClient("mongodb://usha:ushausha@35.209.234.43:27017/admin", serverSelectionTimeoutMS=5000)
    # Trigger a connection check
    client.admin.command('ping')
    print("✅ Connected to MongoDB successfully!")
    db = client["amiable"]
except ConnectionFailure as e:
    print("❌ Connection failed:", e)
