from core.events.event_bus import event_bus
from order.application.handlers.payment_completed_handler import payment_completed_handler

from order.infrastructure.repositories.order_repo_impl import OrderRepository
from core.config.database import async_session_factory


def register_subscribers():
    # Create async DB session (NOT Depends)
    session = async_session_factory()

    # Construct repository with session
    order_repo = OrderRepository(session)

    # Wire event → handler
    event_bus.subscribe(
        "payment.completed",
        lambda event: payment_completed_handler(event, order_repo)
    )
