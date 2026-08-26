from dataclasses import dataclass
from typing import List, Optional

# ---------------------------------------------------------
# REQUEST DTOs
# ---------------------------------------------------------

@dataclass
class AddItemToCartDTO:
    product_id: int
    quantity: int


@dataclass
class UpdateQuantityDTO:
    quantity: int


# ---------------------------------------------------------
# RESPONSE DTOs
# ---------------------------------------------------------

@dataclass
class CartItemDTO:
    product_id: int
    name: str
    price: float
    quantity: int
    image_url: Optional[str]

    @staticmethod
    def from_domain(item):
        return CartItemDTO(
            product_id=item.product_id,
            name=item.name,
            price=item.price,
            quantity=item.quantity,
            image_url=item.image_url
        )


@dataclass
class CartResponseDTO:
    user_id: int
    items: List[CartItemDTO]
    total_quantity: int
    total_price: float

    @staticmethod
    def from_domain(cart):
        items = [CartItemDTO.from_domain(i) for i in cart.items]

        total_quantity = sum(i.quantity for i in cart.items)
        total_price = sum(i.quantity * i.price for i in cart.items)

        return CartResponseDTO(
            user_id=cart.user_id,
            items=items,
            total_quantity=total_quantity,
            total_price=total_price
        )


@dataclass
class CartTotalsResponseDTO:
    subtotal: float
    tax: float
    total: float

    @staticmethod
    def from_domain(totals):
        return CartTotalsResponseDTO(
            subtotal=totals.subtotal,
            tax=totals.tax,
            total=totals.total
        )
