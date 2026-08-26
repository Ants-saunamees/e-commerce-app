# payment/application/dto/paypal_dtos.py

from pydantic import BaseModel


class CreatePayPalPaymentRequestDTO(BaseModel):
    order_id: int
