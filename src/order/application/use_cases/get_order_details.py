from order.domain.entities.order import Order
from order.domain.interfaces.order_repo import IOrderRepository


class GetOrderDetailsUseCase:
    def __init__(self, order_repo: IOrderRepository):
        self.order_repo = order_repo

    async def execute(self, user_id: int, order_id: int) -> Order:
        # 1. Load order
        order = await self.order_repo.get_by_id(order_id)
        if not order:
            raise ValueError("Order not found")

        # 2. Ensure user owns the order
        if order.user_id != user_id:
            raise PermissionError("You do not have access to this order")

        # 3. Return domain order
        return order
