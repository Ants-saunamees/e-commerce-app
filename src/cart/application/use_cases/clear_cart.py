from cart.domain.interfaces.cart_repo import ICartRepository


class ClearCartUseCase:
    def __init__(self, cart_repo: ICartRepository):
        self.cart_repo = cart_repo

    async def execute(self, user_id: int) -> None:
        # If cart does not exist, nothing to clear
        cart = await self.cart_repo.get_by_user_id(user_id)
        if cart is None:
            return

        # Clear items directly in DB
        await self.cart_repo.clear(user_id)
