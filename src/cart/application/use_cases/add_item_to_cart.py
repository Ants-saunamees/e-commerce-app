from cart.domain.interfaces.cart_repo import ICartRepository
from catalog.domain.interfaces.product_repo import IProductRepository
from cart.domain.entities.cart import Cart, CartItem

class AddItemToCartUseCase:
    def __init__(
        self,
        cart_repo: ICartRepository,
        product_repo: IProductRepository
    ):
        self.cart_repo = cart_repo
        self.product_repo = product_repo

    async def execute(self, user_id: int, product_id: int, quantity: int) -> Cart:
        # ---------------------------------------------------------
        # 1. Load product
        # ---------------------------------------------------------
        product = await self.product_repo.get_by_id(product_id)
        if product is None:
            raise ValueError("Product not found")

        if product.stock == 0:
            raise ValueError("Product out of stock")

        # Enforce max stock (Temu-style)
        quantity = min(quantity, product.stock)

        # ---------------------------------------------------------
        # 2. Load or create cart
        # ---------------------------------------------------------
        cart = await self.cart_repo.get_by_user_id(user_id)
        if cart is None:
            cart = Cart(user_id=user_id, items=[])

        # ---------------------------------------------------------
        # 3. Check if item already exists
        # ---------------------------------------------------------
        for item in cart.items:
            if item.product_id == product_id:
                # Merge quantities, but enforce max stock
                new_quantity = min(item.quantity + quantity, product.stock)
                item.quantity = new_quantity
                await self.cart_repo.save(cart)
                return cart

        # ---------------------------------------------------------
        # 4. Add new item
        # ---------------------------------------------------------
        cart.items.append(
            CartItem(
                product_id=product.id,
                name=product.name,
                price=float(product.price),  # ⭐ FIX
                quantity=int(quantity),  # ⭐ FIX
                image_url=product.image_url
            )
        )

        # ---------------------------------------------------------
        # 5. Save cart
        # ---------------------------------------------------------
        await self.cart_repo.save(cart)
        return cart
