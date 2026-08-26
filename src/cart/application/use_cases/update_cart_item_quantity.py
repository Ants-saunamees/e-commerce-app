from cart.domain.interfaces.cart_repo import ICartRepository
from cart.domain.entities.cart import Cart
from catalog.domain.interfaces.product_repo import IProductRepository


class UpdateCartItemQuantityUseCase:
    def __init__(self, cart_repo: ICartRepository, product_repo: IProductRepository):
        self.cart_repo = cart_repo
        self.product_repo = product_repo


    async def execute(self, user_id: int, product_id: int, quantity: int):
        # Load cart
        cart = await self.cart_repo.get_by_user_id(user_id)

        # If no cart exists → return empty cart
        if cart is None:
            return Cart(user_id=user_id, items=[])

        # If quantity is zero → remove item
        if quantity <= 0:
            cart.remove_item(product_id)
        else:
            product = await self.product_repo.get_by_id(product_id)
            if product.stock < quantity:
                raise ValueError("Not enough stock")

            cart.update_quantity(product_id, quantity)

        # Persist changes
        await self.cart_repo.save(cart)

        return cart
