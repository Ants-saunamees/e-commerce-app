from catalog.domain.interfaces.product_repo import IProductRepository

class DeleteProductUseCase:
    def __init__(self, product_repo: IProductRepository, vector_store):
        self.product_repo = product_repo
        self.vector_store = vector_store

    async def execute(self, product_id: int):
        existing = await self.product_repo.get_by_id(product_id)
        if existing is None:
            raise ValueError("Product does not exist")

        # Delete from DB
        await self.product_repo.delete(product_id)

        # Delete from Chroma
        await self.vector_store.delete(product_id)

