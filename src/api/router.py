from fastapi import APIRouter

from auth.routes.auth_routes import router as auth_router
from catalog.routes.product_routes import router as product_router
from cart.routes.cart_routes import router as cart_router
from order.routes.order_routes import router as order_router
from payment.routes.payment_routes import router as payment_router
from search.routes.search_routes import router as search_router
from catalog.routes.category_routes import router as category_router
from admin.routes.admin_routes import router as admin_router


router = APIRouter()

# Include all route groups
router.include_router(auth_router)
router.include_router(product_router)
router.include_router(search_router)
router.include_router(cart_router)
router.include_router(order_router)
router.include_router(payment_router)
router.include_router(category_router)
router.include_router(admin_router)