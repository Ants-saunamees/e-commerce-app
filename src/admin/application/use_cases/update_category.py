from catalog.domain.entities.category import Category


class UpdateCategoryUseCase:
    def __init__(self, category_repo):
        self.category_repo = category_repo

    async def execute(
        self,
        category_id: int,
        name: str | None = None,
        parent_id: int | None = None
    ) -> Category:
        # Validate category exists
        existing = await self.category_repo.get_by_id(category_id)
        if existing is None:
            raise ValueError("Category does not exist")

        # Validate name (if provided)
        if name is not None and name.strip() == "":
            raise ValueError("Category name cannot be empty")

        # Validate parent category (if provided)
        if parent_id is not None:
            parent = await self.category_repo.get_by_id(parent_id)
            if parent is None:
                raise ValueError("Parent category does not exist")

        # Perform update
        updated = await self.category_repo.update(
            category_id=category_id,
            name=name,
            parent_id=parent_id
        )

        return updated
