from order.domain.interfaces.order_repo import IOrderRepository


class MarkOrderPaidUseCase:
    def __init__(self, order_repo: IOrderRepository):
        self.order_repo = order_repo

    async def execute(self, order_id: int):
        order = await self.order_repo.get_by_id(order_id)
        if not order:
            raise ValueError("Order not found")

        order.status = "paid"

        return await self.order_repo.save(order)
