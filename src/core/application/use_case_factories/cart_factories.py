from fastapi import Depends

from core.application.providers.repo_provider import RepoProvider, get_provider

from cart.application.use_cases.add_item_to_cart import AddItemToCartUseCase
from cart.application.use_cases.remove_cart_item import RemoveCartItemUseCase
from cart.application.use_cases.update_cart_item_quantity import UpdateCartItemQuantityUseCase
from cart.application.use_cases.clear_cart import ClearCartUseCase
from cart.application.use_cases.get_cart import GetCartUseCase
from cart.application.use_cases.calculate_cart_totals import CalculateCartTotalsUseCase


# ---------------------------------------------------------
# ADD ITEM TO CART
# ---------------------------------------------------------
def get_add_item_use_case(
    provider: RepoProvider = Depends(get_provider)
) -> AddItemToCartUseCase:
    return AddItemToCartUseCase(
        cart_repo=provider.cart_repo,
        product_repo=provider.product_repo
    )


# ---------------------------------------------------------
# REMOVE ITEM FROM CART
# ---------------------------------------------------------
def get_remove_item_use_case(
    provider: RepoProvider = Depends(get_provider)
) -> RemoveCartItemUseCase:
    return RemoveCartItemUseCase(
        cart_repo=provider.cart_repo
    )


# ---------------------------------------------------------
# UPDATE ITEM QUANTITY
# ---------------------------------------------------------
def get_update_quantity_use_case(
    provider: RepoProvider = Depends(get_provider)
) -> UpdateCartItemQuantityUseCase:
    return UpdateCartItemQuantityUseCase(
        cart_repo=provider.cart_repo,
        product_repo=provider.product_repo
    )


# ---------------------------------------------------------
# CLEAR CART
# ---------------------------------------------------------
def get_clear_cart_use_case(
    provider: RepoProvider = Depends(get_provider)
) -> ClearCartUseCase:
    return ClearCartUseCase(
        cart_repo=provider.cart_repo
    )


# ---------------------------------------------------------
# GET CART
# ---------------------------------------------------------
def get_cart_use_case(
    provider: RepoProvider = Depends(get_provider)
) -> GetCartUseCase:
    return GetCartUseCase(
        cart_repo=provider.cart_repo
    )


# ---------------------------------------------------------
# CALCULATE CART TOTALS
# ---------------------------------------------------------
def get_cart_totals_use_case(
    provider: RepoProvider = Depends(get_provider)
) -> CalculateCartTotalsUseCase:
    return CalculateCartTotalsUseCase(
        cart_repo=provider.cart_repo,
        product_repo=provider.product_repo
    )
