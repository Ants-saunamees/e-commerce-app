from fastapi import Depends
from core.application.providers.repo_provider import RepoProvider, get_provider

from admin.application.use_cases.create_product import CreateProductUseCase
from admin.application.use_cases.update_product import UpdateProductUseCase
from admin.application.use_cases.delete_product import DeleteProductUseCase

from admin.application.use_cases.create_category import CreateCategoryUseCase
from admin.application.use_cases.update_category import UpdateCategoryUseCase
from admin.application.use_cases.delete_category import DeleteCategoryUseCase

from search.domain.services.embedding_service import EmbeddingService
from search.infrastructure.vector_store.chroma_vector_store import ChromaVectorStore
from core.config.chroma_client import get_chroma_client
from core.config.settings import settings
# -----------------------------
# PRODUCT USE CASE FACTORIES
# -----------------------------

def get_create_product_use_case(
    provider: RepoProvider = Depends(get_provider),
    client = Depends(get_chroma_client)
) -> CreateProductUseCase:
    return CreateProductUseCase(
        product_repo=provider.product_repo,
        category_repo=provider.category_repo,
        embedding_service=EmbeddingService(settings.EMBEDDING_MODEL),
        vector_store=ChromaVectorStore(client)
    )


def get_update_product_use_case(
    provider: RepoProvider = Depends(get_provider),
    client = Depends(get_chroma_client)
) -> UpdateProductUseCase:
    return UpdateProductUseCase(
        product_repo=provider.product_repo,
        category_repo=provider.category_repo,
        embedding_service=EmbeddingService(),
        vector_store=ChromaVectorStore(client)
    )



def get_delete_product_use_case(
    provider: RepoProvider = Depends(get_provider),
    client = Depends(get_chroma_client)
) -> DeleteProductUseCase:
    return DeleteProductUseCase(
        product_repo=provider.product_repo,
        vector_store=ChromaVectorStore(client)
    )

# -----------------------------
# CATEGORY USE CASE FACTORIES
# -----------------------------

def get_create_category_use_case(
    provider: RepoProvider = Depends(get_provider)
) -> CreateCategoryUseCase:
    return CreateCategoryUseCase(
        category_repo=provider.category_repo
    )


def get_update_category_use_case(
    provider: RepoProvider = Depends(get_provider)
) -> UpdateCategoryUseCase:
    return UpdateCategoryUseCase(
        category_repo=provider.category_repo
    )


def get_delete_category_use_case(
    provider: RepoProvider = Depends(get_provider)
) -> DeleteCategoryUseCase:
    return DeleteCategoryUseCase(
        category_repo=provider.category_repo
    )
