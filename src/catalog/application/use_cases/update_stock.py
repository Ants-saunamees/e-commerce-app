from catalog.domain.interfaces.product_repo import IProductRepository
from order.domain.interfaces.order_repo import IOrderRepository


class UpdateStockUseCase:
    def __init__(self, order_repo: IOrderRepository, product_repo: IProductRepository):
        self.order_repo = order_repo
        self.product_repo = product_repo

    async def execute(self, order_id: int):
        order = await self.order_repo.get_by_id(order_id)
        if not order:
            raise ValueError("Order not found")

        for item in order.items:
            product = await self.product_repo.get_by_id(item.product_id)
            if not product:
                raise ValueError("Product not found")

            # Reduce stock
            new_stock = product.stock - item.quantity

            # Safety: never allow negative stock
            if new_stock < 0:
                new_stock = 0

            product.stock = new_stock
            await self.product_repo.update(product)
