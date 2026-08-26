from fastapi import APIRouter, Depends, HTTPException

from catalog.application.dto.catalog_dto import ProductResponseDTO

from core.application.use_case_factories.catalog_factories import (
    get_list_products_use_case,
    get_product_details_use_case,
    get_products_by_category_use_case
)

router = APIRouter(prefix="/products", tags=["Products"])


# ---------------------------------------------------------
# 1. LIST PRODUCTS
# ---------------------------------------------------------
@router.get("/", response_model=list[ProductResponseDTO])
async def list_products(use_case = Depends(get_list_products_use_case)):
    try:
        products = await use_case.execute()
        return [ProductResponseDTO.from_domain(p) for p in products]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------
# 3. GET PRODUCT DETAILS
# ---------------------------------------------------------
@router.get("/{product_id}", response_model=ProductResponseDTO)
async def get_product_details(product_id: int, use_case = Depends(get_product_details_use_case)):
    try:
        product = await use_case.execute(product_id)
        return ProductResponseDTO.from_domain(product)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# ---------------------------------------------------------
# 4. LIST PRODUCTS BY CATEGORY
# ---------------------------------------------------------
@router.get("/category/{category_id}", response_model=list[ProductResponseDTO])
async def list_products_by_category(category_id: int, use_case = Depends(get_products_by_category_use_case)):
    try:
        products = await use_case.execute(category_id)
        return [ProductResponseDTO.from_domain(p) for p in products]
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
