from dataclasses import dataclass

@dataclass
class CartTotals:
    subtotal: float
    tax: float
    total: float
