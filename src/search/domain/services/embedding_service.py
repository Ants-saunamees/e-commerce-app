import ollama

import ollama

class EmbeddingService:
    def __init__(self, model_name: str = "nomic-embed-text"):
        self.model_name = model_name

    async def embed(self, text: str):
        try:
            response = ollama.embed(
                model=self.model_name,
                input=text
            )

            if "embeddings" not in response:
                raise ValueError("Embedding model did not return 'embeddings'")

            return response["embeddings"][0]

        except Exception as e:
            raise e

