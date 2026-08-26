from cart.domain.interfaces.cart_repo import ICartRepository
from cart.domain.entities.cart_totals import CartTotals
from catalog.domain.interfaces.product_repo import IProductRepository
from core.config.settings import settings

class CalculateCartTotalsUseCase:
    def __init__(
        self,
        cart_repo: ICartRepository,
        product_repo: IProductRepository,
        tax_rate: float = settings.TAX_RATE
    ):
        self.cart_repo = cart_repo
        self.product_repo = product_repo
        self.tax_rate = tax_rate

    async def execute(self, user_id: int) -> CartTotals:
        cart = await self.cart_repo.get_by_user_id(user_id)
        if cart is None or not cart.items:
            return CartTotals(subtotal=0.0, tax=0.0, total=0.0)

        updated_items = []

        # ---------------------------------------------------------
        # ⭐ TEMU-STYLE AUTO-FIX STOCK
        # ---------------------------------------------------------
        for item in cart.items:
            product = await self.product_repo.get_by_id(item.product_id)
            if not product:
                continue  # product removed from catalog

            if product.stock == 0:
                continue  # remove item completely

            if item.quantity > product.stock:
                item.quantity = product.stock  # reduce to max available

            updated_items.append(item)

        # Save fixed cart
        cart.items = updated_items
        await self.cart_repo.save(cart)

        # ---------------------------------------------------------
        # 2. Calculate subtotal
        # ---------------------------------------------------------
        subtotal = sum(item.price * item.quantity for item in cart.items)

        # ---------------------------------------------------------
        # 3. Calculate tax
        # ---------------------------------------------------------
        tax = subtotal * self.tax_rate

        # ---------------------------------------------------------
        # 4. Calculate total
        # ---------------------------------------------------------
        total = subtotal + tax

        return CartTotals(
            subtotal=subtotal,
            tax=tax,
            total=total
        )
