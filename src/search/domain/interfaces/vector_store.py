# search/domain/interfaces/vector_store.py

class VectorStore:
    async def add(self, id: int, embedding: list[float]):
        ...


    async def search(self, embedding: list[float], limit: int = 10) -> list[int]:
        ...
