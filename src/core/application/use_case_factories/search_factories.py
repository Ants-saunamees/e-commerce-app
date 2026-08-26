from fastapi import Depends

from core.application.providers.repo_provider import RepoProvider, get_provider

from search.domain.services.embedding_service import EmbeddingService
from search.infrastructure.vector_store.chroma_vector_store import ChromaVectorStore
from search.application.use_cases.hybrid_search import HybridSearchUseCase

from core.config.chroma_client import get_chroma_client
from core.config.settings import settings


def get_search_use_case(
    provider: RepoProvider = Depends(get_provider),
    client = Depends(get_chroma_client)
) -> HybridSearchUseCase:
    embedding_service = EmbeddingService(settings.EMBEDDING_MODEL)

    return HybridSearchUseCase(
        embedding_service=embedding_service,
        vector_store=ChromaVectorStore(client),
        product_repo=provider.product_repo,
    )
