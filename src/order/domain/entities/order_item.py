from dataclasses import dataclass, field
from datetime import datetime
from typing import List


@dataclass
class OrderItem:
    product_id: int
    name: str
    price: float
    quantity: int
    image_url: str | None = None
