from cart.domain.interfaces.cart_repo import ICartRepository
from cart.domain.entities.cart import Cart


class GetCartUseCase:
    def __init__(self, cart_repo: ICartRepository):
        self.cart_repo = cart_repo

    async def execute(self, user_id: int) -> Cart:
        # Load cart from repository
        cart = await self.cart_repo.get_by_user_id(user_id)

        # If no cart exists, return an empty one
        if cart is None:
            return Cart(user_id=user_id, items=[])

        return cart
