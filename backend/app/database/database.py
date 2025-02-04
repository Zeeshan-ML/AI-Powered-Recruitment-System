# db.py

import os
from pymongo import MongoClient # type: ignore
from dotenv import load_dotenv # type: ignore

# Load environment variables from .env file
load_dotenv()

# Get MongoDB connection URL and DB name from .env file
mongodb_url = os.getenv("MONGODB_URL")
db_name = os.getenv("MONGODB_DB_NAME")

# Establish MongoDB connection
client = MongoClient(mongodb_url)

# Access the specific database
db = client[db_name]

# Example usage: Accessing a collection
collection = db.users  # Replace 'your_collection_name' with the actual collection name

print(f"Connected to database: {db_name}")
