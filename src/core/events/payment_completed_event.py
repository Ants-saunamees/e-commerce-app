from dataclasses import dataclass
from datetime import datetime
from .event import Event


@dataclass
class PaymentCompletedEvent(Event):
    payment_id: int
    order_id: int
    user_id: int
    amount: float

    @staticmethod
    def create(payment_id: int, order_id: int, user_id: int, amount: float):
        return PaymentCompletedEvent(
            name="payment.completed",
            occurred_at=datetime.utcnow(),
            payment_id=payment_id,
            order_id=order_id,
            user_id=user_id,
            amount=amount
        )
