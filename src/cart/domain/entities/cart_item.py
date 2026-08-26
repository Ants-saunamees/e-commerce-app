from dataclasses import dataclass
from typing import Optional

@dataclass
class CartItem:
    product_id: int
    quantity: int
    price: float  # snapshot of price at time added
    name: str     # optional snapshot
    image_url: Optional[str] = None

