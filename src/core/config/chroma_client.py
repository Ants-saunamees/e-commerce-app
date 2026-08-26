# src/core/config/chroma_client.py

from chromadb import PersistentClient

def get_chroma_client():
    return PersistentClient(path="chroma_data")

