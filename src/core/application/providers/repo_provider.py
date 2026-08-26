from auth.infrastructure.repositories.user_repo_impl import UserRepository
from auth.infrastructure.repositories.token_repo_impl import TokenRepository
from cart.infrastructure.repositories.cart_repo_impl import CartRepository
from catalog.infrastructure.repositories.category_repo_impl import CategoryRepository
from catalog.infrastructure.repositories.product_repo_impl import ProductRepository
from order.infrastructure.repositories.order_repo_impl import OrderRepository
from payment.infrastructure.repositories.payment_repo_impl import PaymentRepository

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from core.config.database import get_session



class RepoProvider:
    def __init__(self, session: AsyncSession):
        self.session = session

        # Auth
        self.user_repo = UserRepository(session)
        self.token_repo = TokenRepository(session)

        # Orders
        self.order_repo = OrderRepository(session)

        # Payments
        self.payment_repo = PaymentRepository(session)

        # Catalog
        self.category_repo = CategoryRepository(session)
        self.product_repo = ProductRepository(session, self.category_repo)

        # Cart
        self.cart_repo = CartRepository(session)




async def get_provider(
    session: AsyncSession = Depends(get_session)):
    return RepoProvider(session)