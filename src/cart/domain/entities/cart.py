from dataclasses import dataclass
from typing import List, Optional
from cart.domain.entities.cart_item import CartItem

@dataclass
class Cart:
    user_id: int
    items: List[CartItem]

    def add_item(self, product_id: int, quantity: int, price: float, name: str, image_url: Optional[str]):
        # If item exists, increase quantity
        for item in self.items:
            if item.product_id == product_id:
                item.quantity += quantity
                return
        # Otherwise add new item
        self.items.append(
            CartItem(
                product_id=product_id,
                quantity=quantity,
                price=price,
                name=name,
                image_url=image_url
            )
        )

    def remove_item(self, product_id: int):
        self.items = [item for item in self.items if item.product_id != product_id]

    def update_quantity(self, product_id: int, quantity: int):
        for item in self.items:
            if item.product_id == product_id:
                item.quantity = quantity
                return

    def clear(self):
        self.items = []
