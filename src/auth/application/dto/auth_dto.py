from dataclasses import dataclass
from datetime import datetime
# ---------------------------------------------------------
# REQUEST DTO (used for both register + login)
# ---------------------------------------------------------
@dataclass
class UserRequestDTO:
    email: str
    password: str


@dataclass
class UserReadDTO:
    id: int
    email: str
    is_admin: bool
    is_active: bool
    created_at: datetime
