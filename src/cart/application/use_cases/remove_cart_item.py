from cart.domain.interfaces.cart_repo import ICartRepository
from cart.domain.entities.cart import Cart


class RemoveCartItemUseCase:
    def __init__(self, cart_repo: ICartRepository):
        self.cart_repo = cart_repo

    async def execute(self, user_id: int, product_id: int) -> Cart:
        # Load cart
        cart = await self.cart_repo.get_by_user_id(user_id)

        # If no cart exists → nothing to remove
        if cart is None:
            return Cart(user_id=user_id, items=[])

        # Remove item using domain entity logic
        cart.remove_item(product_id)

        # Persist changes
        await self.cart_repo.save(cart)

        return cart
